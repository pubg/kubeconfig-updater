package raw_config_service

import "fmt"

type Service struct {
	providerMap map[string]ConfigProvider
}

func NewService() *Service {
	return &Service{
		providerMap: make(map[string]ConfigProvider),
	}
}

func (s *Service) AddProvider(provider ConfigProvider) error {
	providerName := provider.Name()
	if _, exists := s.providerMap[providerName]; exists {
		return fmt.Errorf("provider %s is already registered", providerName)
	}

	s.providerMap[providerName] = provider

	return nil
}

func (s *Service) GetConfig(name string) (*string, error) {
	provider, exists := s.providerMap[name]
	if !exists {
		return nil, fmt.Errorf("provider %s not registered", name)
	}

	return provider.GetConfig()
}

func (s *Service) SetConfig(name string, data string) error {
	provider, exists := s.providerMap[name]
	if !exists {
		return fmt.Errorf("provider %s not registered", name)
	}

	return provider.SetConfig(data)
}
