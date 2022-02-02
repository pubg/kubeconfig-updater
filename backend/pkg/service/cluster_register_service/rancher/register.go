package rancher

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/rancher_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type Register struct {
	credResolver credentials.CredResolver
	extension   *configs.Extension
}

func NewRancherResolver(credResolver credentials.CredResolver, extension *configs.Extension) cluster_register_service.ClusterRegister {
	return &Register{credResolver: credResolver, extension: extension}
}

func (r *Register) RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error {
	cfg, err := r.credService.GetRancherSdkConfig(credConf)
	if err != nil {
		return err
	}
	clusterId, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterId.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterId.String())
	}
	return rancher_service.RegisterRancherCluster(cfg, clusterId)
}
