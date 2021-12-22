package cred_resolver_service

import (
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cred_resolver_config_persist"
)

type CredResolverStoreService struct {
	store *cred_resolver_config_persist.CredResolverConfigStorage
}

func NewCredResolverService(store *cred_resolver_config_persist.CredResolverConfigStorage) *CredResolverStoreService {
	return &CredResolverStoreService{store: store}
}

func (s *CredResolverStoreService) ListCredResolvers() []*protos.CredResolverConfig {
	return s.store.ListConfigs()
}

func (s *CredResolverStoreService) GetCredResolver(credResolverId string) (*protos.CredResolverConfig, bool, error) {
	if credResolverId == "" {
		return nil, false, fmt.Errorf("credResolverId should not be empty")
	}

	cfg, exists := s.store.GetConfig(credResolverId)
	if !exists {
		return nil, false, nil
	}
	return cfg, true, nil
}

func (s *CredResolverStoreService) SetCredResolver(cfg *protos.CredResolverConfig) error {
	if cfg == nil {
		return fmt.Errorf("credResolverConfig should not be null")
	}

	return s.store.SetAndSaveConfig(cfg)
}

func (s *CredResolverStoreService) DeleteCredResolver(credResolverId string) error {
	return s.store.DeleteConfig(credResolverId)
}
