package gcp

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/container/v1"
	"google.golang.org/api/option"
)

func init() {
	factory := &cluster_metadata_service.CloudMetaResolverFactory{FactoryFunc: NewGcpResolver}
	if err := cluster_metadata_service.RegisterCloudResolverFactory(types.InfraVendor_GCP, factory); err != nil {
		log.Fatalln(err)
	}
}

type Resolver struct {
	projectId string
	cred      *google.Credentials
}

func NewGcpResolver(cred credentials.CredResolver, projectId string) (cluster_metadata_service.ClusterMetadataResolver, error) {
	gcpCred, _, err := cred.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("GetGcpSdkConfig: %v", err)
	}

	resolver := &Resolver{
		cred:      gcpCred.(*google.Credentials),
		projectId: projectId,
	}
	return resolver, nil
}

func (g *Resolver) ListClusters() ([]*protos.ClusterMetadata, error) {
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

func (g *Resolver) GetResolverDescription() string {
	return fmt.Sprintf("GCP/%s", g.projectId)
}
