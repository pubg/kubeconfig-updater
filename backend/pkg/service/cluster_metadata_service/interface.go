package cluster_metadata_service

import (
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type ClusterMetadataResolver interface {
	ListClusters() ([]*protos.ClusterMetadata, error)
	GetResolverDescription() string
}

type CloudMetaResolverFactory struct {
	FactoryFunc   NewMetadataResolver
	ClusterEngine types.KnownClusterEngine
	InfraVendor   types.InfraVendor
}

type NewMetadataResolver func(credCfg *protos.CredResolverConfig, accountId string, credService *cred_resolver_service.CredResolveService) (ClusterMetadataResolver, error)

var resolverFactories []*CloudMetaResolverFactory

func init() {
	resolverFactories = []*CloudMetaResolverFactory{
		{
			FactoryFunc:   NewAwsResolver,
			ClusterEngine: types.KnownClusterEngine_EKS,
			InfraVendor:   types.InfraVendor_AWS,
		},
		{
			FactoryFunc:   NewAzureResolver,
			ClusterEngine: types.KnownClusterEngine_AKS,
			InfraVendor:   types.InfraVendor_Azure,
		},
		{
			FactoryFunc:   NewTencentResolver,
			ClusterEngine: types.KnownClusterEngine_TKE,
			InfraVendor:   types.InfraVendor_Tencent,
		},
		{
			FactoryFunc:   NewGcpResolver,
			ClusterEngine: types.KnownClusterEngine_GKE,
			InfraVendor:   types.InfraVendor_GCP,
		},
	}
}
