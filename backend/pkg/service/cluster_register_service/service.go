package cluster_register_service

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

type ClusterRegisterService struct {
	credService *cred_resolver_service.CredResolveService
	metaService *cluster_metadata_service.ClusterMetadataService
	extension   *configs.Extension

	registerMutex sync.Mutex
}

func NewClusterRegisterService(credService *cred_resolver_service.CredResolveService, metaService *cluster_metadata_service.ClusterMetadataService, extension *configs.Extension) *ClusterRegisterService {
	service := &ClusterRegisterService{
		credService: credService,
		metaService: metaService,
		extension:   extension,
	}
	return service
}

func (s *ClusterRegisterService) RegisterCluster(ctx context.Context, clusterName string, credConf *protos.CredResolverConfig) error {
	// aws, az, gcloud, tccli are not support concurrent register
	s.registerMutex.Lock()
	defer s.registerMutex.Unlock()

	meta, exists := s.metaService.GetClusterMetadata(clusterName)
	if !exists {
		return fmt.Errorf("NotFoundMetadataInCache: %s", clusterName)
	}

	factory := s.getTargetRegisterFactory(credConf.GetInfraVendor())
	if factory == nil {
		return fmt.Errorf("NotSupportedVendor: %s", credConf.GetInfraVendor())
	}

	register := factory.FactoryFunc(s.credService, s.extension)
	err := register.RegisterCluster(ctx, credConf, meta)
	if err != nil {
		return err
	}

	return nil
}

func (s *ClusterRegisterService) getTargetRegisterFactory(vendor string) *RegisterFactory {
	for _, factory := range registerFactories {
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
