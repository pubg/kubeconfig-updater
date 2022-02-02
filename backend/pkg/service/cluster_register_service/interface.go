package cluster_register_service

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type ClusterRegister interface {
	RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error
}

var factories = map[types.InfraVendor]*RegisterFactory{}

type RegisterFactory struct {
	FactoryFunc NewClusterRegister
}

type NewClusterRegister func(credResolver credentials.CredResolver, extension *configs.Extension) (ClusterRegister, error)

func RegisterRegisterFactory(vendor types.InfraVendor, factory *RegisterFactory) error {
	if _, exists := factories[vendor]; exists {
		return fmt.Errorf("DuplicatedFactory: Try to Register %s Twice", vendor.String())
	}
	factories[vendor] = factory
	return nil
}

func GetFactory(vendor types.InfraVendor) (*RegisterFactory, bool) {
	fac, exists := factories[vendor]
	return fac, exists
}
