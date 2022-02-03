package rancher

import (
	"context"
	"fmt"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/rancher_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"github.com/rancher/cli/config"
)

func init() {
	factory := &cluster_register_service.RegisterFactory{FactoryFunc: NewRancherResolver}
	if err := cluster_register_service.RegisterRegisterFactory(types.InfraVendor_Rancher, factory); err != nil {
		log.Fatalln(err)
	}
}

type Register struct {
	cfg *config.ServerConfig
}

func NewRancherResolver(credResolver credentials.CredResolver, extension *configs.Extension) (cluster_register_service.ClusterRegister, error) {
	rawCfg, _, err := credResolver.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, err
	}

	return &Register{cfg: rawCfg.(*config.ServerConfig)}, nil
}

func (r *Register) RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error {
	mc, err := rancher_service.NewManagementClient(r.cfg, types.RANCHER_TIMEOUT)
	if err != nil {
		return fmt.Errorf("NewMasterClient: %v", err)
	}

	clusterId, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterId.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterId.String())
	}
	return rancher_service.RegisterRancherCluster(mc, clusterId)
}
