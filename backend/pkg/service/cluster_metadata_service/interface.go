package cluster_metadata_service

import (
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type ClusterMetadataResolver interface {
	ListClusters() ([]*protos.ClusterMetadata, error)
	GetResolverDescription() string
}

var cloudResolverFactories = map[types.InfraVendor]*CloudMetaResolverFactory{}

type CloudMetaResolverFactory struct {
	FactoryFunc NewCloudMetaResolver
}

type NewCloudMetaResolver func(cred credentials.CredResolver, accountId string) (ClusterMetadataResolver, error)

func RegisterCloudResolverFactory(vendor types.InfraVendor, factory *CloudMetaResolverFactory) error {
	if _, exists := cloudResolverFactories[vendor]; exists {
		return fmt.Errorf("DuplicatedFactory: Try to Register %s Twice", vendor.String())
	}
	cloudResolverFactories[vendor] = factory
	return nil
}

func GetCloudResolverFactory(vendor types.InfraVendor) (*CloudMetaResolverFactory, bool) {
	fac, exists := cloudResolverFactories[vendor]
	return fac, exists
}

var basicResolverFactories = []*BasicMetaResolverFactory{}

type BasicMetaResolverFactory struct {
	FactoryFunc NewBasicMetaResolver
}

// NewBasicMetaResolver Can Returns nil Slice with no Error
type NewBasicMetaResolver func(ext *configs.Extension) ([]ClusterMetadataResolver, error)

func RegisterBasicResolverFactories(factoryFunc *BasicMetaResolverFactory) {
	basicResolverFactories = append(basicResolverFactories, factoryFunc)
}

func GetBasicResolverFactories() []*BasicMetaResolverFactory {
	copySlice := make([]*BasicMetaResolverFactory, len(basicResolverFactories))
	copy(copySlice, basicResolverFactories)
	return copySlice
}
