package tke

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type Register struct {
	credResolver credentials.CredResolver
	extension   *configs.Extension
}

func NewTkeRegister(credResolver credentials.CredResolver, extension *configs.Extension) cluster_register_service.ClusterRegister {
	return &Register{credResolver: credResolver, extension: extension}
}

func (r *Register) RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error {
	clusterName := meta.Metadata.ClusterName

	credProvider, err := r.credService.GetTencentSdkConfig(credConf)
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
