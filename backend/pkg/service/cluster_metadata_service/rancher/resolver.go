package rancher

import (
	"context"
	"fmt"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/rancher_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"github.com/rancher/cli/config"
	rancherTypes "github.com/rancher/norman/types"
)

func init() {
	factory := &cluster_metadata_service.CloudMetaResolverFactory{FactoryFunc: NewRancherResolver}
	if err := cluster_metadata_service.RegisterCloudResolverFactory(types.InfraVendor_Rancher, factory); err != nil {
		log.Fatalln(err)
	}
}

type Resolver struct {
	cfg        *config.ServerConfig
	serverName string
}

func NewRancherResolver(cred credentials.CredResolver, serverName string) (cluster_metadata_service.ClusterMetadataResolver, error) {
	rawCfg, _, err := cred.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("GetRancherSdkConfig: %v", err)
	}

	resolver := &Resolver{
		cfg:        rawCfg.(*config.ServerConfig),
		serverName: serverName,
	}
	return resolver, nil
}

func (r *Resolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	mc, err := rancher_service.NewManagementClient(r.cfg, types.RANCHER_TIMEOUT)
	if err != nil {
		return nil, fmt.Errorf("NewMasterClient: %v", err)
	}

	option := &rancherTypes.ListOpts{Filters: map[string]interface{}{
		"filter": true,
		"limit":  -1,
	}}
	res, err := mc.Cluster.List(option)
	if err != nil {
		return nil, err
	}

	var clusters []*protos.ClusterMetadata
	for _, cluster := range res.Data {
		meta := &protos.ClusterMetadata{
			ClusterName:    cluster.Name,
			CredResolverId: r.serverName,
			ClusterTags:    map[string]string{},
		}

		for key, value := range cluster.Labels {
			meta.ClusterTags[key] = value
		}

		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterId.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterId.String()] = cluster.ID
		}

		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()] = types.KnownClusterEngine_RKE.String()
		}
		clusters = append(clusters, meta)
	}
	return clusters, nil
}

func (r *Resolver) GetResolverDescription() string {
	return fmt.Sprintf("Rancher/%s", r.serverName)
}
