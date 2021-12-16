package cluster_metadata_service

import (
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/api/types"
	"github.com/pubg/kubeconfig-updater/backend/pkg/application"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

type ClusterMetadataResolver interface {
	ListClusters() ([]*protos.ClusterMetadata, error)
	GetResolverType() protos.MetadataResolverType
	GetResolverDescription() string
}

func ListClusterMetadatas() []*protos.AggregatedClusterMetadata {
	return application.GetInstance().AggreagtedClusterMetadataCacheStorage.ListAggrMetadata()
}

func GetClusterMetadata(clusterName string) (*protos.AggregatedClusterMetadata, bool) {
	return application.GetInstance().AggreagtedClusterMetadataCacheStorage.GetAggrMetadata(clusterName)
}

func SyncAvailableClusters() error {
	resolvers, err := ListMetadataResolvers()
	if err != nil {
		return err
	}
	for _, resolver := range resolvers {
		fmt.Printf("Resolver Status: %s\n", resolver.GetResolverDescription())
	}

	aggrMetaMap := map[string]*protos.AggregatedClusterMetadata{}
	for _, resolver := range resolvers {
		metadatas, err := resolver.ListClusters()
		if err != nil {
			fmt.Printf("List cluster metadata occurred error, resolver type:%s, err:%s\n", resolver.GetResolverType().String(), err.Error())
		}
		fmt.Printf("Cluster Metadata Resolver %s resolved %d clusters\n", resolver.GetResolverDescription(), len(metadatas))
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

func ListMetadataResolvers() ([]ClusterMetadataResolver, error) {
	var metaResolvers []ClusterMetadataResolver
	fox, err := NewFoxResolver()
	if err != nil {
		return nil, err
	}
	metaResolvers = append(metaResolvers, fox)

	credResolvers := cred_resolver_service.ListCredResolvers()
	for _, cr := range credResolvers {
		if strings.EqualFold(cr.InfraVendor, types.INFRAVENDOR_AWS) {
			awsResolver, err := NewAwsResolver(cr, cr.AccountId)
			if err != nil {
				return nil, err
			}
			metaResolvers = append(metaResolvers, awsResolver)
		} else if strings.EqualFold(cr.InfraVendor, types.INFRAVENDOR_Azure) {
			authorizer, err := NewAzureResolver(cr, cr.AccountId)
			if err != nil {
				return nil, err
			}
			metaResolvers = append(metaResolvers, authorizer)
		} else if strings.EqualFold(cr.InfraVendor, types.INFRAVENDOR_Tencent) {
			tcResolver, err := NewTencentResolver(cr, cr.AccountId)
			if err != nil {
				return nil, err
			}
			metaResolvers = append(metaResolvers, tcResolver)
		}
	}
	return metaResolvers, nil
}