package gcp

import (
	"context"
	"fmt"
	"github.com/binxio/gcloudconfig"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"golang.org/x/oauth2/google"
	"log"
)

func init() {
	factory := &credentials.CredResolverFactory{NewCredResolverFunc: NewGcpResolver}
	if err := credentials.RegisterFactory(types.InfraVendor_GCP, factory); err != nil {
		log.Fatalln(err)
	}
}

func NewGcpResolver(credConf *protos.CredResolverConfig) (credentials.CredResolver, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		return &DefaultCliResolver{}, nil
	case protos.CredentialResolverKind_ENV:
		return &DefaultChainResolver{}, nil
	case protos.CredentialResolverKind_IMDS:
		return &DefaultChainResolver{}, nil
	case protos.CredentialResolverKind_PROFILE:
		profile, err := credentials.GetProfileFromAttribute(credConf.GetResolverAttributes())
		if err != nil {
			return nil, err
		}
		return &ConfigurationResolver{configuration: profile}, nil
	}

	return nil, fmt.Errorf(credentials.NotSupportedCredKind, credConf.GetKind().String())
}

type DefaultCliResolver struct {
}

func (r *DefaultCliResolver) GetSdkConfig(ctx context.Context) (cred interface{}, projectId string, err error) {
	cfg, err := gcloudconfig.GetCredentials("")
	if err != nil {
		return nil, "", err
	}

	return cfg, cfg.ProjectID, nil
}

func (r *DefaultCliResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_GCP
}

func (r *DefaultCliResolver) Description() string {
	return "GCP-Cred/DefaultCli"
}

func (r *DefaultCliResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type DefaultChainResolver struct {
}

func (r *DefaultChainResolver) GetSdkConfig(ctx context.Context) (cred interface{}, projectId string, err error) {
	cred, err = google.FindDefaultCredentials(ctx)
	if err != nil {
		return nil, "", err
	}
	return cred, "", nil
}

func (r *DefaultChainResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_GCP
}

func (r *DefaultChainResolver) Description() string {
	return "GCP-Cred/DefaultChain"
}

func (r *DefaultChainResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type ConfigurationResolver struct {
	configuration string
}

func (r *ConfigurationResolver) GetSdkConfig(ctx context.Context) (cred interface{}, projectId string, err error) {
	cfg, err := gcloudconfig.GetCredentials(r.configuration)
	if err != nil {
		return nil, "", err
	}
	return cfg, r.configuration, nil
}

func (r *ConfigurationResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_GCP
}

func (r *ConfigurationResolver) Description() string {
	return fmt.Sprintf("GCP-Cred/Configuration:%s", r.configuration)
}

func (r *ConfigurationResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

func getStatus(ctx context.Context, resolver credentials.CredResolver) (protos.CredentialResolverStatus, error, error) {
	rawCred, _, err := resolver.GetSdkConfig(ctx)
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}

	cred := rawCred.(*google.Credentials)
	_, err = cred.TokenSource.Token()
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}

	return protos.CredentialResolverStatus_CRED_REGISTERED_OK, nil, nil
}
