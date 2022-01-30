package cluster_metadata_service

import (
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/concurrency"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cluster_metadata_persist"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

type ClusterMetadataService struct {
	credService      *cred_resolver_service.CredResolveService
	credStoreService *cred_resolver_service.CredResolverStoreService
	cache            *cluster_metadata_persist.AggregatedClusterMetadataStorage
	cfg              *configs.ApplicationConfig
}

func NewClusterMetadataService(credService *cred_resolver_service.CredResolveService, credStoreService *cred_resolver_service.CredResolverStoreService, cache *cluster_metadata_persist.AggregatedClusterMetadataStorage, cfg *configs.ApplicationConfig) *ClusterMetadataService {
	return &ClusterMetadataService{credService: credService, credStoreService: credStoreService, cache: cache, cfg: cfg}
}

func (s *ClusterMetadataService) ListClusterMetadatas() []*protos.AggregatedClusterMetadata {
	return s.cache.ListAggrMetadata()
}

func (s *ClusterMetadataService) GetClusterMetadata(clusterName string) (*protos.AggregatedClusterMetadata, bool) {
	return s.cache.GetAggrMetadata(clusterName)
}

func (s *ClusterMetadataService) SetClusterRegisteredStatus(clusterName string) error {
	meta, exists := s.cache.GetAggrMetadata(clusterName)
	if !exists {
		fmt.Printf("Cache not hit to find registered cluster, skip update cache ClusterName:%s\n", clusterName)
		return nil
	}
	meta.Status = protos.ClusterInformationStatus_REGISTERED_OK
	return s.cache.SetAggrMetadata(meta)
}

func (s *ClusterMetadataService) SyncAvailableClusters() error {
	resolvers, err := s.ListMetadataResolvers()
	if err != nil {
		return err
	}

	listClustersOuts := concurrency.Parallel(common.ToInterfaceSlice(resolvers), func(in interface{}) (output interface{}, err error) {
		resolver, ok := in.(ClusterMetadataResolver)
		if !ok {
			return nil, fmt.Errorf("cannot cast input to ClusterMetadataResolver")
		}
		return resolver.ListClusters()
	})

	regedMetaMap := map[string]bool{}
	availMetaMap := map[string]*protos.AggregatedClusterMetadata{}
	for _, out := range listClustersOuts {
		resolver := out.Input.(ClusterMetadataResolver)
		if out.Err != nil {
			fmt.Printf("List cluster metadata occurred error, resolver desc:%s, err:%s\n", resolver.GetResolverDescription(), out.Err.Error())
			continue
		}

		metadatas := out.Output.([]*protos.ClusterMetadata)
		fmt.Printf("Cluster Metadata Resolver %s resolved %d clusters, duration: %.2fs\n", resolver.GetResolverDescription(), len(metadatas), out.Duration.Seconds())
		for _, metadata := range metadatas {
			if aggrMeta, exists := availMetaMap[metadata.ClusterName]; exists {
				aggrMeta.Metadata = mergeMetadata(aggrMeta.Metadata, metadata)
				aggrMeta.DataResolvers = append(aggrMeta.DataResolvers, resolver.GetResolverDescription())
			} else {
				availMetaMap[metadata.ClusterName] = &protos.AggregatedClusterMetadata{
					Metadata:      metadata,
					DataResolvers: []string{resolver.GetResolverDescription()},
					Status:        protos.ClusterInformationStatus_SUGGESTION_OK,
				}
			}

			if _, ok := resolver.(*KubeconfigResolver); ok {
				regedMetaMap[metadata.ClusterName] = true
			}
		}
	}

	for _, meta := range availMetaMap {
		status := getClusterInfoStatus(s.credStoreService, meta.Metadata.CredResolverId)
		if _, exists := regedMetaMap[meta.Metadata.ClusterName]; exists {
			if status == "not_exists" {
				meta.Status = protos.ClusterInformationStatus_REGISTERED_NOTOK_NO_CRED_RESOLVER
			} else if status == "not_ok" {
				meta.Status = protos.ClusterInformationStatus_REGISTERED_NOTOK_CRED_RES_NOTOK
			} else if status == "ok" {
				meta.Status = protos.ClusterInformationStatus_REGISTERED_OK
			}
		} else {
			if status == "not_exists" {
				meta.Status = protos.ClusterInformationStatus_SUGGESTION_NOTOK_NO_CRED_RESOLVER
			} else if status == "not_ok" {
				meta.Status = protos.ClusterInformationStatus_SUGGESTION_NOTOK_CRED_RES_NOTOK
			} else if status == "ok" {
				meta.Status = protos.ClusterInformationStatus_SUGGESTION_OK
			}
		}
	}

	var metas []*protos.AggregatedClusterMetadata
	for _, meta := range availMetaMap {
		metas = append(metas, meta)
	}
	s.cache.ClearAndSet(metas)
	err = s.cache.SaveStorage()
	if err != nil {
		return err
	}
	return nil
}

func getClusterInfoStatus(credStoreService *cred_resolver_service.CredResolverStoreService, credResolverId string) string {
	if credResolverId == "" {
		return "not_exists"
	}
	credResolver, exists, err := credStoreService.GetCredResolver(credResolverId)
	if err != nil {
		return "not_ok"
	}
	if !exists {
		return "not_exists"
	}
	if credResolver.Status == protos.CredentialResolverStatus_CRED_REGISTERED_OK {
		return "ok"
	}
	return "not_ok"
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

func (s *ClusterMetadataService) ListMetadataResolvers() ([]ClusterMetadataResolver, error) {
	var metaResolvers []ClusterMetadataResolver
	if s.cfg.Extensions.Fox.Enable {
		fox, err := NewFoxResolver(s.cfg.Extensions.Fox.Address)
		if err != nil {
			return nil, err
		}
		metaResolvers = append(metaResolvers, fox)
	}

	kubeconfigs, err := NewKubeconfigResolvers()
	if err != nil {
		return nil, err
	}
	for _, resolver := range kubeconfigs {
		metaResolvers = append(metaResolvers, resolver)
	}

	credResolvers := s.credStoreService.ListCredResolvers()
	for _, cr := range credResolvers {
		factory := s.getTargetResolverFactory(cr.InfraVendor)
		resolver, err := factory.FactoryFunc(cr, cr.AccountId, s.credService)
		if err != nil {
			return nil, err
		}
		metaResolvers = append(metaResolvers, resolver)
	}
	return metaResolvers, nil
}

func (s *ClusterMetadataService) getTargetResolverFactory(vendor string) *CloudMetaResolverFactory {
	for _, factory := range resolverFactories {
		// TODO: Deprecated resolve method
		if strings.EqualFold(factory.InfraVendor.String(), vendor) {
			return factory
		}

		if strings.EqualFold(factory.ClusterEngine.String(), vendor) {
			return factory
		}
	}
	return nil
}
