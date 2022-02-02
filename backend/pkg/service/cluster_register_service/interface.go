package cluster_register_service

import (
	"context"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type ClusterRegister interface {
	RegisterCluster(ctx context.Context, credConf *protos.CredResolverConfig, meta *protos.AggregatedClusterMetadata) error
}

type RegisterFactory struct {
	FactoryFunc   NewClusterRegister
	ClusterEngine types.KnownClusterEngine
	InfraVendor   types.InfraVendor
}

type NewClusterRegister func(credService *cred_resolver_service.CredResolveService, extension *configs.Extension) ClusterRegister

var registerFactories []*RegisterFactory

func init() {
	registerFactories = []*RegisterFactory{
		{
			FactoryFunc:   NewEksRegister,
			ClusterEngine: types.KnownClusterEngine_EKS,
			InfraVendor:   types.InfraVendor_AWS,
		},
		{
			FactoryFunc:   NewAksRegister,
			ClusterEngine: types.KnownClusterEngine_AKS,
			InfraVendor:   types.InfraVendor_Azure,
		},
		{
			FactoryFunc:   NewTkeRegister,
			ClusterEngine: types.KnownClusterEngine_TKE,
			InfraVendor:   types.InfraVendor_Tencent,
		},
		{
			FactoryFunc:   NewGkeRegister,
			ClusterEngine: types.KnownClusterEngine_GKE,
			InfraVendor:   types.InfraVendor_GCP,
		},
		{
			FactoryFunc:   NewRancherResolver,
			ClusterEngine: types.KnownClusterEngine_RKE,
			InfraVendor:   types.InfraVendor_Rancher,
		},
	}
}
