package raw_config_service

import "fmt"

type Service struct {
	providerMap map[string]ConfigProvider
}

func NewService(providers ...ConfigProvider) (*Service, error) {
	service := &Service{
		providerMap: make(map[string]ConfigProvider),
	}

	for _, provider := range providers {
		err := service.addProvider(provider)
		if err != nil {
			return nil, err
		}
	}

	return service, nil
}

func (s *Service) addProvider(provider ConfigProvider) error {
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
