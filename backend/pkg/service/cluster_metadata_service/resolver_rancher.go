package cluster_metadata_service

import (
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"github.com/rancher/cli/cliclient"
	rancherTypes "github.com/rancher/norman/types"
)

type RancherResolver struct {
	masterClient *cliclient.MasterClient
	serverName   string
}

func NewRancherResolver(credCfg *protos.CredResolverConfig, serverName string, credService *cred_resolver_service.CredResolveService) (ClusterMetadataResolver, error) {
	cfg, err := credService.GetRancherSdkConfig(credCfg)
	if err != nil {
		return nil, fmt.Errorf("GetRancherSdkConfig: %v", err)
	}
	mc, err := cliclient.NewMasterClient(cfg)
	if err != nil {
		return nil, fmt.Errorf("NewMasterClient: %v", err)
	}

	resolver := &RancherResolver{
		masterClient: mc,
		serverName:   serverName,
	}
	return resolver, nil
}

func (r *RancherResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	option := &rancherTypes.ListOpts{Filters: map[string]interface{}{
		"filter": true,
		"limit":  -1,
	}}
	res, err := r.masterClient.ManagementClient.Cluster.List(option)
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

		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()] = types.KnownClusterEngine_RKE.String()
		}
		clusters = append(clusters, meta)
	}
	return clusters, nil
}

func (r *RancherResolver) GetResolverDescription() string {
	return fmt.Sprintf("Rancher/%s", r.serverName)
}
