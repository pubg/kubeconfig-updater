package tencent

import (
	"context"
	"fmt"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
)

func init() {
	factory := &credentials.CredResolverFactory{NewCredResolverFunc: NewTencentResolver}
	if err := credentials.RegisterFactory(types.InfraVendor_Tencent, factory); err != nil {
		log.Fatalln(err)
	}
}

func NewTencentResolver(credConf *protos.CredResolverConfig) (credentials.CredResolver, error) {
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
		return &ProfileResolver{profile: profile}, nil
	}

	return nil, fmt.Errorf(credentials.NotSupportedCredKind, credConf.GetKind().String())
}

type DefaultResolver struct {
}

func (r *DefaultResolver) GetSdkConfig(ctx context.Context) (cred interface{}, profile string, err error) {
	provider, err := common.NewProviderChain([]common.Provider{common.DefaultEnvProvider(), common.DefaultProfileProvider(), common.DefaultCvmRoleProvider(), tencent_service.NewTencentIntlProfileProvider("default")}), nil
	return provider, "", err
}

func (r *DefaultResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Tencent
}

func (r *DefaultResolver) Description() string {
	return "Tencent-Cred/DefaultChain"
}

func (r *DefaultResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type EnvResolver struct {
}

func (r *EnvResolver) GetSdkConfig(ctx context.Context) (cred interface{}, profile string, err error) {
	return common.DefaultEnvProvider(), "", nil
}

func (r *EnvResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Tencent
}

func (r *EnvResolver) Description() string {
	return "Tencent-Cred/ENV"
}

func (r *EnvResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type ImdsResolver struct {
}

func (r *ImdsResolver) GetSdkConfig(ctx context.Context) (cred interface{}, profile string, err error) {
	return common.DefaultCvmRoleProvider(), "", nil
}

func (r *ImdsResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Tencent
}

func (r *ImdsResolver) Description() string {
	return "Tencent-Cred/IMDS"
}

func (r *ImdsResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type ProfileResolver struct {
	profile string
}

func (r *ProfileResolver) GetSdkConfig(ctx context.Context) (cred interface{}, profile string, err error) {
	return tencent_service.NewTencentIntlProfileProvider(r.profile), r.profile, nil
}

func (r *ProfileResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_Tencent
}

func (r *ProfileResolver) Description() string {
	return fmt.Sprintf("AWS-Cred/Profile:%s", r.profile)
}

func (r *ProfileResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

func getStatus(ctx context.Context, resolver credentials.CredResolver) (protos.CredentialResolverStatus, error, error) {
	credProvider, _, err := resolver.GetSdkConfig(ctx)
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}
	_, err = tencent_service.GetConfigInfo(credProvider.(common.Provider))
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}
	return protos.CredentialResolverStatus_CRED_REGISTERED_OK, nil, nil
}
