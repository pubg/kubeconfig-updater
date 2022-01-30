package cluster_metadata_service

import (
	"context"
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/container/v1"
	"google.golang.org/api/option"
)

type GcpResolver struct {
	projectId string
	cred      *google.Credentials
}

func NewGcpResolver(credCfg *protos.CredResolverConfig, projectId string, credService *cred_resolver_service.CredResolveService) (*GcpResolver, error) {
	cred, _, err := credService.GetGcpSdkConfig(context.TODO(), credCfg)
	if err != nil {
		return nil, fmt.Errorf("GetGcpSdkConfig: %v", err)
	}

	resolver := &GcpResolver{
		projectId: projectId,
		cred:      cred,
	}
	return resolver, nil
}

func (g *GcpResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	ctx := context.Background()
	containerService, err := container.NewService(ctx, option.WithCredentials(g.cred))
	if err != nil {
		return nil, err
	}

	res, err := containerService.Projects.Zones.Clusters.List(g.projectId, "-").Do()
	if err != nil {
		return nil, err
	}

	var clusters []*protos.ClusterMetadata
	for _, cluster := range res.Clusters {
		meta := &protos.ClusterMetadata{
			ClusterName:    cluster.Name,
			CredResolverId: g.projectId,
			ClusterTags:    map[string]string{},
		}

		for key, value := range cluster.ResourceLabels {
			meta.ClusterTags[key] = value
		}

		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterRegion.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterRegion.String()] = cluster.Location
		}

		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()] = types.KnownClusterEngine_GKE.String()
		}
		clusters = append(clusters, meta)
	}

	return clusters, nil
}

func (g *GcpResolver) GetResolverDescription() string {
	return fmt.Sprintf("GCP/%s", g.projectId)
}
