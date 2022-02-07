package aks

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

func init() {
	factory := &cluster_register_service.RegisterFactory{FactoryFunc: NewAksRegister}
	if err := cluster_register_service.RegisterRegisterFactory(types.InfraVendor_Azure, factory); err != nil {
		log.Fatalln(err)
	}
}

type Register struct {
	subscriptionId string
}

func NewAksRegister(credResolver credentials.CredResolver, extension *configs.Extension) (cluster_register_service.ClusterRegister, error) {
	_, subscriptionId, err := credResolver.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, err
	}
	return &Register{
		subscriptionId: subscriptionId,
	}, nil
}

func (r *Register) RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error {
	resourceGroup, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ResourceGroup.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ResourceGroup.String())
	}
	return azure_service.RegisterAksCluster(resourceGroup, meta.Metadata.ClusterName, r.subscriptionId)
}
