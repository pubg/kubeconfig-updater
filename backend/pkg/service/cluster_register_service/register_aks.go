package cluster_register_service

import (
	"context"
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type AksRegister struct {
	credService *cred_resolver_service.CredResolveService
	extension   *configs.Extension
}

func NewAksRegister(credService *cred_resolver_service.CredResolveService, extension *configs.Extension) ClusterRegister {
	return &AksRegister{credService: credService, extension: extension}
}

func (r *AksRegister) RegisterCluster(ctx context.Context, credConf *protos.CredResolverConfig, meta *protos.AggregatedClusterMetadata) error {
	resourceGroup, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ResourceGroup.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ResourceGroup.String())
	}
	return azure_service.RegisterAksCluster(resourceGroup, meta.Metadata.ClusterName)
}
