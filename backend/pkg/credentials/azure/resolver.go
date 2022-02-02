package azure

import (
	"context"
	"fmt"
	"github.com/Azure/go-autorest/autorest/azure/auth"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"log"
)

func init() {
	factory := &credentials.CredResolverFactory{NewCredResolverFunc: NewAzureResolver}
	if err := credentials.RegisterFactory(types.InfraVendor_Azure, factory); err != nil {
		log.Fatalln(err)
	}
}

func NewAzureResolver(credConf *protos.CredResolverConfig) (credentials.CredResolver, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		return &DefaultResolver{}, nil
	case protos.CredentialResolverKind_ENV:
		return &EnvResolver{}, nil
	case protos.CredentialResolverKind_IMDS:
		return &ImdsResolver{}, nil
	case protos.CredentialResolverKind_PROFILE:
		profile, err := credentials.GetProfileFromAttribute(credConf.GetResolverAttributes())
		if err != nil {
			return nil, err
		}
		return &SubscriptionResolver{subscription: profile}, nil
	}

	return nil, fmt.Errorf(credentials.NotSupportedCredKind, credConf.GetKind().String())
}

type DefaultResolver struct {
}

func (r *DefaultResolver) GetSdkConfig(ctx context.Context) (cred interface{}, accountId string, err error) {
	cfg, err := azure_service.NewCliAuthConfig("")
	return cfg, "", err
}

func (r *DefaultResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Azure
}

func (r *DefaultResolver) Description() string {
	return "Azure-Cred/DefaultCli"
}

func (r *DefaultResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type EnvResolver struct {
}

func (r *EnvResolver) GetSdkConfig(ctx context.Context) (cred interface{}, accountId string, err error) {
	cfg, err := azure_service.NewEnvAuthConfig()
	return cfg, "", err
}

func (r *EnvResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Azure
}

func (r *EnvResolver) Description() string {
	return "Azure-Cred/ENV"
}

func (r *EnvResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type ImdsResolver struct {
}

func (r *ImdsResolver) GetSdkConfig(ctx context.Context) (cred interface{}, accountId string, err error) {
	return auth.NewMSIConfig(), "", nil
}

func (r *ImdsResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Azure
}

func (r *ImdsResolver) Description() string {
	return "Azure-Cred/IMDS"
}

func (r *ImdsResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type SubscriptionResolver struct {
	subscription string
}

func (r *SubscriptionResolver) GetSdkConfig(ctx context.Context) (cred interface{}, accountId string, err error) {
	cfg, err := azure_service.NewCliAuthConfig(r.subscription)
	return cfg, r.subscription, err
}

func (r *SubscriptionResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Azure
}

func (r *SubscriptionResolver) Description() string {
	return fmt.Sprintf("Azure-Cred/Subscription:%s", r.subscription)
}

func (r *SubscriptionResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

func getStatus(ctx context.Context, resolver credentials.CredResolver) (protos.CredentialResolverStatus, error, error) {
	authConfig, _, err := resolver.GetSdkConfig(ctx)
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}

	_, err = authConfig.(auth.AuthorizerConfig).Authorizer()
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}

	return protos.CredentialResolverStatus_CRED_REGISTERED_OK, nil, nil
}
