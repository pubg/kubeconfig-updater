package cluster_metadata_service

import "github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"

type aggregatedResolver struct {

}

func (a *aggregatedResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	panic("implement me")
}

func (a *aggregatedResolver) GetCluster(clusterName string) (*protos.ClusterMetadata, bool, error) {
	panic("implement me")
}

func (a *aggregatedResolver) GetResolverType() protos.MetadataResolverType {
	panic("implement me")
}
