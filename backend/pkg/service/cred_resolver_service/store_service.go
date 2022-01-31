package cred_resolver_service

import (
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cred_resolver_config_persist"
)

type CredResolverStoreService struct {
	configs   *cred_resolver_config_persist.CredResolverConfigStorage
	instances map[string]credentials.CredResolver
}

func NewCredResolverService(store *cred_resolver_config_persist.CredResolverConfigStorage) (*CredResolverStoreService, error) {
	service := &CredResolverStoreService{
		configs:   store,
		instances: map[string]credentials.CredResolver{},
	}

	for _, cfg := range store.ListConfigs() {
		err := service.setCredResolverInstance(cfg)
		if err != nil {
			return nil, err
		}
	}
	return service, nil
}

func (s *CredResolverStoreService) ListCredResolverConfigs() []*protos.CredResolverConfig {
	return s.configs.ListConfigs()
}

func (s *CredResolverStoreService) GetCredResolverConfig(credResolverId string) (*protos.CredResolverConfig, bool, error) {
	if credResolverId == "" {
		return nil, false, fmt.Errorf("credResolverId should not be empty")
	}

	cfg, exists := s.configs.GetConfig(credResolverId)
	if !exists {
		return nil, false, nil
	}
	return cfg, true, nil
}

func (s *CredResolverStoreService) SetCredResolverConfig(cfg *protos.CredResolverConfig) error {
	if cfg == nil {
		return fmt.Errorf("InvalidArguments: CresResolverConfig Should not be null")
	}
	if cfg.InfraVendor == "" || cfg.AccountId == "" {
		return fmt.Errorf("InvalidArguments: cred.InfraVendor or cred.AccountId Should not be Empty")
	}

	err := s.setCredResolverInstance(cfg)
	if err != nil {
		return err
	}

	return s.configs.SetAndSaveConfig(cfg)
}

func (s *CredResolverStoreService) DeleteCredResolverConfig(credResolverId string) error {
	s.deleteCredResolverInstance(credResolverId)
	return s.configs.DeleteConfig(credResolverId)
}

func (s *CredResolverStoreService) GetCredResolverInstance(credResolverId string) (credentials.CredResolver, bool) {
	resolver, exists := s.instances[credResolverId]
	return resolver, exists
}

func (s *CredResolverStoreService) setCredResolverInstance(cfg *protos.CredResolverConfig) error {
	vendor, ok := types.ToInfraVendorIgnoreCase(cfg.InfraVendor)
	if !ok {
		return fmt.Errorf("InvalidArguments: Vendor '%s' Not Supported Type", vendor.String())
	}

	factory, exists := credentials.GetFactory(vendor)
	if !exists {
		return fmt.Errorf("FactoryNotFound: Vendor='%s'", vendor.String())
	}

	resolver, err := factory.NewCredResolverFunc(cfg)
	if err != nil {
		return err
	}

	s.instances[cfg.AccountId] = resolver
	return nil
}

func (s *CredResolverStoreService) deleteCredResolverInstance(credResolverId string) {
	delete(s.instances, credResolverId)
}
