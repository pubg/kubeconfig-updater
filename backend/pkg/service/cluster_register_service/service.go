package cluster_register_service

import (
	"context"
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/aks_helper"
	"github.com/pubg/kubeconfig-updater/backend/internal/api/types"
	"github.com/pubg/kubeconfig-updater/backend/internal/eks_helper"
	"github.com/pubg/kubeconfig-updater/backend/internal/tke_helper"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

type ClusterRegisterService struct {
	credService *cred_resolver_service.CredResolverService
	metaService *cluster_metadata_service.ClusterMetadataService
}

func NewClusterRegisterService(credService *cred_resolver_service.CredResolverService, metaService *cluster_metadata_service.ClusterMetadataService) *ClusterRegisterService {
	return &ClusterRegisterService{credService: credService, metaService: metaService}
}

func (s *ClusterRegisterService) RegisterCluster(ctx context.Context, clusterName string, credConf *protos.CredResolverConfig) error {
	meta, exists := s.metaService.GetClusterMetadata(clusterName)
	if !exists {
		return fmt.Errorf("cannot find clusterRegion information in metadataResolver clusterName:%s", clusterName)
	}

	vendor := credConf.GetInfraVendor()
	if strings.EqualFold(vendor, types.INFRAVENDOR_AWS) {
		_, profile, err := s.credService.GetAwsSdkConfig(ctx, credConf)
		if err != nil {
			return err
		}
		if profile == "" {
			return fmt.Errorf("cred kind(%s) is not acceptable to register EKS", credConf.GetKind())
		}
		return eks_helper.RegisterEksWithIamUser(clusterName, meta.Metadata.ClusterTags[types.CLUSTERTAGS_ClusterRegion], profile)
	} else if strings.EqualFold(vendor, types.INFRAVENDOR_Azure) {
		return aks_helper.RegisterAksCluster(meta.Metadata.ClusterTags[types.CLUSTERTAGS_ResourceGroup], clusterName)
	} else if strings.EqualFold(vendor, types.INFRAVENDOR_Tencent) {
		credProvider, err := s.credService.GetTencentSdkConfig(credConf)
		if err != nil {
			return err
		}
		return tke_helper.RegisterTkeCluster0(meta.Metadata.ClusterTags[types.CLUSTERTAGS_ClusterRegion], meta.Metadata.ClusterTags[types.CLUSTERTAGS_ClusterId], clusterName, credProvider)
	}
	return fmt.Errorf("not supported infraVendor value %s", credConf.GetInfraVendor())
}

func (s ClusterRegisterService) DeleteCluster(ctx context.Context, clusterName string) error {
	return nil
}
