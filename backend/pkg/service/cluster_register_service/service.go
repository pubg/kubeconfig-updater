package cluster_register_service

import (
	"context"
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type ClusterRegisterService struct {
	credService *cred_resolver_service.CredResolveService
	metaService *cluster_metadata_service.ClusterMetadataService
}

func NewClusterRegisterService(credService *cred_resolver_service.CredResolveService, metaService *cluster_metadata_service.ClusterMetadataService) *ClusterRegisterService {
	return &ClusterRegisterService{credService: credService, metaService: metaService}
}

func (s *ClusterRegisterService) RegisterCluster(ctx context.Context, clusterName string, credConf *protos.CredResolverConfig) error {
	meta, exists := s.metaService.GetClusterMetadata(clusterName)
	if !exists {
		return fmt.Errorf("cannot find clusterRegion information in metadataResolver clusterName:%s", clusterName)
	}

	vendor := credConf.GetInfraVendor()
	if strings.EqualFold(vendor, types.InfraVendor_AWS.String()) {
		_, profileOrEmpty, err := s.credService.GetAwsSdkConfig(ctx, credConf)
		if err != nil {
			return err
		}
		clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTags_ClusterRegion.String())
		if err != nil {
			return fmt.Errorf("clusterMetadata should have ClusterRegion tag, but not exists")
		}
		return aws_service.RegisterEksWithIamUser(clusterName, clusterRegion, profileOrEmpty)
	} else if strings.EqualFold(vendor, types.InfraVendor_Azure.String()) {
		resourceGroup, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTags_ResourceGroup.String())
		if err != nil {
			return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTags_ResourceGroup.String())
		}
		return azure_service.RegisterAksCluster(resourceGroup, clusterName)
	} else if strings.EqualFold(vendor, types.InfraVendor_Tencent.String()) {
		credProvider, err := s.credService.GetTencentSdkConfig(credConf)
		if err != nil {
			return err
		}
		clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTags_ClusterRegion.String())
		if err != nil {
			return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTags_ClusterRegion.String())
		}
		clusterId, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTags_ClusterId.String())
		if err != nil {
			return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTags_ClusterId.String())
		}
		return tencent_service.RegisterTkeCluster0(clusterRegion, clusterId, clusterName, credProvider)
	}
	return fmt.Errorf("not supported infraVendor value %s", credConf.GetInfraVendor())
}
