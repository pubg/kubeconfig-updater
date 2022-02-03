package gke

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/gcp_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

func init() {
	factory := &cluster_register_service.RegisterFactory{FactoryFunc: NewGkeRegister}
	if err := cluster_register_service.RegisterRegisterFactory(types.InfraVendor_GCP, factory); err != nil {
		log.Fatalln(err)
	}
}

type Register struct {
	configurationOrEmpty string
}

func NewGkeRegister(credResolver credentials.CredResolver, extension *configs.Extension) (cluster_register_service.ClusterRegister,error) {
	_, configurationOrEmpty, err := credResolver.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, err
	}
	return &Register{configurationOrEmpty: configurationOrEmpty}, nil
}

func (r *Register) RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error {
	clusterName := meta.Metadata.ClusterName

	clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterRegion.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterRegion.String())
	}
	return gcp_service.RegisterGkeCluster(clusterRegion, clusterName, r.configurationOrEmpty)
}
