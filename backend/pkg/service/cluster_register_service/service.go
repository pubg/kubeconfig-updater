package cluster_register_service

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/expressions"
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
	extension   *configs.Extension

	registerMutex sync.Mutex
}

func NewClusterRegisterService(credService *cred_resolver_service.CredResolveService, metaService *cluster_metadata_service.ClusterMetadataService, extension *configs.Extension) *ClusterRegisterService {
	return &ClusterRegisterService{credService: credService, metaService: metaService, extension: extension}
}

func (s *ClusterRegisterService) RegisterCluster(ctx context.Context, clusterName string, credConf *protos.CredResolverConfig) error {
	// aws, az, gcloud, tccli are not support concurrent register
	s.registerMutex.Lock()
	defer s.registerMutex.Unlock()

	meta, exists := s.metaService.GetClusterMetadata(clusterName)
	if !exists {
		return fmt.Errorf("cannot find clusterRegion information in metadataResolver clusterName:%s", clusterName)
	}

	vendor := credConf.GetInfraVendor()
	if strings.EqualFold(vendor, types.InfraVendor_AWS.String()) {
		return s.registerEks(ctx, clusterName, credConf, meta)
	} else if strings.EqualFold(vendor, types.InfraVendor_Azure.String()) {
		resourceGroup, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ResourceGroup.String())
		if err != nil {
			return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ResourceGroup.String())
		}
		return azure_service.RegisterAksCluster(resourceGroup, clusterName)
	} else if strings.EqualFold(vendor, types.InfraVendor_Tencent.String()) {
		credProvider, err := s.credService.GetTencentSdkConfig(credConf)
		if err != nil {
			return err
		}
		clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterRegion.String())
		if err != nil {
			return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterRegion.String())
		}
		clusterId, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterId.String())
		if err != nil {
			return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterId.String())
		}
		return tencent_service.RegisterTkeCluster0(clusterRegion, clusterId, clusterName, credProvider)
	}
	return fmt.Errorf("not supported infraVendor value %s", credConf.GetInfraVendor())
}

func (s *ClusterRegisterService) registerEks(ctx context.Context, clusterName string, credConf *protos.CredResolverConfig, meta *protos.AggregatedClusterMetadata) error {
	_, profileOrEmpty, err := s.credService.GetAwsSdkConfig(ctx, credConf)
	if err != nil {
		return err
	}
	clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterRegion.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterRegion.String())
	}

	for _, roleExt := range s.extension.EksAssumeRoles {
		clusterExpr, err := expressions.NewFromConfig(roleExt.ClusterFilterExpression)
		if err != nil {
			return err
		}

		//모든 태그 넣어야 할듯
		inputMap := map[string]string{
			"ClusterName":   clusterName,
			"ClusterRegion": clusterRegion,
		}
		matched, err := clusterExpr.MatchEvaluate(inputMap, clusterName)
		if err != nil {
			return err
		}

		if matched {
			roleExpr, err := expressions.NewFromConfig(roleExt.RoleNameExpression)
			if err != nil {
				return err
			}

			roleArn, err := roleExpr.StringEvaluate(inputMap, []interface{}{clusterName, clusterRegion})
			if err != nil {
				return err
			}
			return aws_service.RegisterEks(clusterName, clusterRegion, roleArn, profileOrEmpty)
		}
	}

	return aws_service.RegisterEks(clusterName, clusterRegion, "", profileOrEmpty)
}
