package tke

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	tcCommon "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

func init() {
	factory := &cluster_register_service.RegisterFactory{FactoryFunc: NewTkeRegister}
	if err := cluster_register_service.RegisterRegisterFactory(types.InfraVendor_Tencent, factory); err != nil {
		log.Fatalln(err)
	}
}

type Register struct {
	provider tcCommon.Provider
}

func NewTkeRegister(credResolver credentials.CredResolver, extension *configs.Extension) (cluster_register_service.ClusterRegister, error) {
	rawProvider, _, err := credResolver.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, err
	}
	provider := rawProvider.(tcCommon.Provider)
	return &Register{provider: provider}, nil
}

func (r *Register) RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error {
	clusterName := meta.Metadata.ClusterName

	clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterRegion.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterRegion.String())
	}
	clusterId, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterId.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterId.String())
	}
	return tencent_service.RegisterTkeCluster0(clusterRegion, clusterId, clusterName, r.provider)
}
