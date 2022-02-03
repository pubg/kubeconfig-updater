package cred_resolver_service

type CredResolveService struct {
	credStoreService *CredResolverStoreService
}

func NewCredResolveService(credStoreService *CredResolverStoreService) *CredResolveService {
	return &CredResolveService{credStoreService: credStoreService}
}
