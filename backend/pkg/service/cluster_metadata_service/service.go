package cluster_metadata_service

import (
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/api/types"
	"github.com/pubg/kubeconfig-updater/backend/internal/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cluster_metadata_persist"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

type ClusterMetadataResolver interface {
	ListClusters() ([]*protos.ClusterMetadata, error)
	GetResolverDescription() string
}

type ClusterMetadataService struct {
	credService *cred_resolver_service.CredResolverService
	cache       *cluster_metadata_persist.AggregatedClusterMetadataStorage
	cfg         *configs.ApplicationConfig
}

func NewClusterMetadataService(credService *cred_resolver_service.CredResolverService, cache *cluster_metadata_persist.AggregatedClusterMetadataStorage, cfg *configs.ApplicationConfig) *ClusterMetadataService {
	return &ClusterMetadataService{credService: credService, cache: cache, cfg: cfg}
}

func (s *ClusterMetadataService) ListClusterMetadatas() []*protos.AggregatedClusterMetadata {
	return s.cache.ListAggrMetadata()
}

func (s *ClusterMetadataService) GetClusterMetadata(clusterName string) (*protos.AggregatedClusterMetadata, bool) {
	return s.cache.GetAggrMetadata(clusterName)
}

func (s *ClusterMetadataService) SyncAvailableClusters() error {
	resolvers, err := s.ListMetadataResolvers()
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
			fmt.Printf("List cluster metadata occurred error, resolver desc:%s, err:%s\n", resolver.GetResolverDescription(), err.Error())
			continue
		}
		fmt.Printf("Cluster Metadata Resolver %s resolved %d clusters\n", resolver.GetResolverDescription(), len(metadatas))
		for _, metadata := range metadatas {
			if aggrMeta, exists := aggrMetaMap[metadata.ClusterName]; exists {
				aggrMeta.Metadata = mergeMetadata(aggrMeta.Metadata, metadata)
				aggrMeta.DataResolvers = append(aggrMeta.DataResolvers, resolver.GetResolverDescription())
			} else {
				aggrMetaMap[metadata.ClusterName] = &protos.AggregatedClusterMetadata{
					Metadata:      metadata,
					DataResolvers: []string{resolver.GetResolverDescription()},
					Status:        protos.ClusterInformationStatus_SUGGESTION_OK,
				}
			}
		}
	}

	var metas []*protos.AggregatedClusterMetadata
	for _, meta := range aggrMetaMap {
		metas = append(metas, meta)
	}
	s.cache.ClearAndSet(metas)
	err = s.cache.SaveStorage()
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

	credResolvers := s.credService.ListCredResolvers()
	for _, cr := range credResolvers {
		if strings.EqualFold(cr.InfraVendor, types.INFRAVENDOR_AWS) {
			awsResolver, err := NewAwsResolver(cr, cr.AccountId, s.credService)
			if err != nil {
				return nil, err
			}
			metaResolvers = append(metaResolvers, awsResolver)
		} else if strings.EqualFold(cr.InfraVendor, types.INFRAVENDOR_Azure) {
			authorizer, err := NewAzureResolver(cr, cr.AccountId, s.credService)
			if err != nil {
				return nil, err
			}
			metaResolvers = append(metaResolvers, authorizer)
		} else if strings.EqualFold(cr.InfraVendor, types.INFRAVENDOR_Tencent) {
			tcResolver, err := NewTencentResolver(cr, cr.AccountId, s.credService)
			if err != nil {
				return nil, err
			}
			metaResolvers = append(metaResolvers, tcResolver)
		}
	}
	return metaResolvers, nil
}
