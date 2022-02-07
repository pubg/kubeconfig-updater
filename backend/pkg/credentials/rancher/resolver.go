package rancher

import (
	"context"
	"fmt"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/rancher_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	rancherCfg "github.com/rancher/cli/config"
	rancherTypes "github.com/rancher/norman/types"
)

func init() {
	factory := &credentials.CredResolverFactory{NewCredResolverFunc: NewRancherResolver}
	if err := credentials.RegisterFactory(types.InfraVendor_Rancher, factory); err != nil {
		log.Fatalln(err)
	}
}

func NewRancherResolver(credConf *protos.CredResolverConfig) (credentials.CredResolver, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		return &DefaultResolver{}, nil
	case protos.CredentialResolverKind_PROFILE:
		profile, err := credentials.GetProfileFromAttribute(credConf.GetResolverAttributes())
		if err != nil {
			return nil, err
		}
		return &ServerResolver{server: profile}, nil
	}

	return nil, fmt.Errorf(credentials.NotSupportedCredKind, credConf.GetKind().String())
}

type DefaultResolver struct {
}

func (r *DefaultResolver) GetSdkConfig(ctx context.Context) (cred interface{}, serverName string, err error) {
	cfg, err := rancher_service.LoadConfig()
	if err != nil {
		return nil, "", err
	}
	return cfg.FocusedServer(), cfg.CurrentServer, nil
}

func (r *DefaultResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Rancher
}

func (r *DefaultResolver) Description() string {
	return "Rancher-Cred/DefaultCli"
}

func (r *DefaultResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type ServerResolver struct {
	server string
}

func (r *ServerResolver) GetSdkConfig(ctx context.Context) (cred interface{}, serverName string, err error) {
	cfg, err := rancher_service.LoadConfig()
	if err != nil {
		return nil, "", err
	}
	if server, ok := cfg.Servers[r.server]; ok {
		return server, r.server, nil
	}
	return nil, "", fmt.Errorf("NotFoundTargetServerConfig: %s", r.server)
}

func (r *ServerResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Rancher
}

func (r *ServerResolver) Description() string {
	return fmt.Sprintf("Rancher-Cred/Server:%s", r.server)
}

func (r *ServerResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

func getStatus(ctx context.Context, resolver credentials.CredResolver) (protos.CredentialResolverStatus, error, error) {
	rawCred, _, err := resolver.GetSdkConfig(ctx)
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}

	serverCfg := rawCred.(*rancherCfg.ServerConfig)

	client, err := rancher_service.NewCAPIClient(serverCfg, types.RANCHER_TIMEOUT)
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}

	var rawRes interface{}
	err = client.APIBaseClient.List("userpreference", &rancherTypes.ListOpts{}, &rawRes)
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, fmt.Errorf("GetUserpreferences, err: %s", err.Error()), nil
	}

	return protos.CredentialResolverStatus_CRED_REGISTERED_OK, nil, nil
}
