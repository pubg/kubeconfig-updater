package cluster_register_service

import (
	"context"
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/gcp_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type GkeRegister struct {
	credService *cred_resolver_service.CredResolveService
	extension   *configs.Extension
}

func NewGkeRegister(credService *cred_resolver_service.CredResolveService, extension *configs.Extension) ClusterRegister {
	return &GkeRegister{credService: credService, extension: extension}
}

func (r *GkeRegister) RegisterCluster(ctx context.Context, credConf *protos.CredResolverConfig, meta *protos.AggregatedClusterMetadata) error {
	clusterName := meta.Metadata.ClusterName

	_, configurationName, err := r.credService.GetGcpSdkConfig(ctx, credConf)
	if err != nil {
		return err
	}
	clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterRegion.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterRegion.String())
	}
	return gcp_service.RegisterGkeCluster(clusterRegion, clusterName, configurationName)
}
