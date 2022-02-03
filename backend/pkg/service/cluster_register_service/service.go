package cluster_register_service

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"sync"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
)

type ClusterRegisterService struct {
	metaService *cluster_metadata_service.ClusterMetadataService
	extension   *configs.Extension

	registerMutex sync.Mutex
}

func NewClusterRegisterService(metaService *cluster_metadata_service.ClusterMetadataService, extension *configs.Extension) *ClusterRegisterService {
	return &ClusterRegisterService{metaService: metaService, extension: extension, registerMutex: sync.Mutex{}}
}

func (s *ClusterRegisterService) RegisterCluster(ctx context.Context, clusterName string, credResolver credentials.CredResolver) error {
	// some vendors are not support concurrent register
	s.registerMutex.Lock()
	defer s.registerMutex.Unlock()

	meta, exists := s.metaService.GetClusterMetadata(clusterName)
	if !exists {
		return fmt.Errorf("NotFoundMetadataInCache: %s", clusterName)
	}

	factory, exists := GetFactory(credResolver.SupportIdentityType())
	if !exists {
		return fmt.Errorf("NotSupportedVendor: '%s'", credResolver.SupportIdentityType().String())
	}

	register, err := factory.FactoryFunc(credResolver, s.extension)
	if err != nil {
		return err
	}
	err = register.RegisterCluster(ctx, meta)
	if err != nil {
		return err
	}

	return nil
}

