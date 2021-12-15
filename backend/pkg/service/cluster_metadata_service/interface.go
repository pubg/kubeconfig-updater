package cluster_metadata_service

import (
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/application"
)

type ClusterMetadataResolver interface {
	ListClusters() ([]*protos.ClusterMetadata, error)
	GetResolverType() protos.MetadataResolverType
}

func ListClusterMetadatas() []*protos.AggregatedClusterMetadata {
	return application.GetInstance().AggreagtedClusterMetadataCacheStorage.ListAggrMetadata()
}

func GetClusterMetadata(clusterName string) (*protos.AggregatedClusterMetadata, bool) {
	return application.GetInstance().AggreagtedClusterMetadataCacheStorage.GetAggrMetadata(clusterName)
}

func SyncAvailableClusters() error {
	resolvers, err := listMetadataResolvers()
	if err != nil {
		return err
	}

	aggrMetaMap := map[string]*protos.AggregatedClusterMetadata{}

	for _, resolver := range resolvers {
		metadatas, err := resolver.ListClusters()
		if err != nil {
			fmt.Printf("List cluster metadata occurred error, resolver type:%s, err:%+v\n", resolver.GetResolverType().String(), err)
		}
		for _, metadata := range metadatas {
			if aggrMeta, exists := aggrMetaMap[metadata.ClusterName]; exists {
				aggrMeta.Metadata = mergeMetadata(aggrMeta.Metadata, metadata)
				aggrMeta.DataResolvers = append(aggrMeta.DataResolvers, resolver.GetResolverType())
			} else {
				aggrMetaMap[metadata.ClusterName] = &protos.AggregatedClusterMetadata{
					Metadata:      metadata,
					DataResolvers: []protos.MetadataResolverType{resolver.GetResolverType()},
					Status:        protos.ClusterInformationStatus_SUGGESTION_OK,
				}
			}
		}
	}

	app := application.GetInstance()
	app.AggreagtedClusterMetadataCacheStorage.ClearStorage()
	for _, aggrMeta := range aggrMetaMap {
		err = app.AggreagtedClusterMetadataCacheStorage.SetAggrMetadata(aggrMeta)
		if err != nil {
			return err
		}
	}
	err = app.AggreagtedClusterMetadataCacheStorage.SaveStorage()
	if err != nil {
		return err
	}

	return nil
}

func mergeMetadata(a *protos.ClusterMetadata, b *protos.ClusterMetadata) *protos.ClusterMetadata {
	merged := &protos.ClusterMetadata{
		ClusterName:    a.ClusterName,
		CredResolverId: "",
		ClusterTags:    map[string]string{},
	}

	if a.CredResolverId != "" {
		merged.CredResolverId = a.CredResolverId
	}
	if b.CredResolverId != "" {
		merged.CredResolverId = b.CredResolverId
	}
	if a.ClusterTags != nil {
		merged.ClusterTags = a.ClusterTags
	}
	if b.ClusterTags != nil {
		for k, v := range b.ClusterTags {
			merged.ClusterTags[k] = v
		}
	}
	return merged
}

func listMetadataResolvers() ([]ClusterMetadataResolver, error) {
	//application.GetInstance().CredResolverConfigStorage.ListConfigs()
	fox, err := NewFoxResolver()
	if err != nil {
		return nil, err
	}

	return []ClusterMetadataResolver{fox}, nil
}
