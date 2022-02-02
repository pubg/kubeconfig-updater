package cluster_register_service

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/rancher_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type RancherRegister struct {
	credService *cred_resolver_service.CredResolveService
	extension   *configs.Extension
}

func NewRancherResolver(credService *cred_resolver_service.CredResolveService, extension *configs.Extension) ClusterRegister {
	return &RancherRegister{credService: credService, extension: extension}
}

func (r *RancherRegister) RegisterCluster(ctx context.Context, credConf *protos.CredResolverConfig, meta *protos.AggregatedClusterMetadata) error {
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
