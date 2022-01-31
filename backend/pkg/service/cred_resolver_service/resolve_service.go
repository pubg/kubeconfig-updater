package cred_resolver_service

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"strings"

	"github.com/binxio/gcloudconfig"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/rancher_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"golang.org/x/oauth2/google"

	"github.com/Azure/go-autorest/autorest/azure/auth"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	rancherCfg "github.com/rancher/cli/config"
	tcCommon "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
)

type CredResolveService struct {
	credStoreService *CredResolverStoreService
}

func NewCredResolveService(credStoreService *CredResolverStoreService) *CredResolveService {
	return &CredResolveService{credStoreService: credStoreService}
}

func (s *CredResolveService) GetAwsSdkConfig(ctx context.Context, credConf *protos.CredResolverConfig) (*aws.Config, string, error) {
	factory, exists := credentials.GetFactory(types.InfraVendor_AWS)
	if !exists {
		return nil, "", fmt.Errorf("FactoryNotFound")
	}

	resolver, err := factory.NewCredResolverFunc(credConf)
	if err != nil {
		return nil, "", err
	}

	cred, accountId, err := resolver.GetSdkConfig(ctx)
	if err != nil {
		return nil, "", err
	}
	return cred.(*aws.Config), accountId, nil
}

// GetAzureSdkConfig Azure Cli does not support multi subscription
func (s *CredResolveService) GetAzureSdkConfig(ctx context.Context, credConf *protos.CredResolverConfig) (auth.AuthorizerConfig, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		return azure_service.NewCliAuthConfig("")
	case protos.CredentialResolverKind_ENV:
		return azure_service.NewEnvAuthConfig()
	case protos.CredentialResolverKind_IMDS:
		return auth.NewMSIConfig(), nil
	case protos.CredentialResolverKind_PROFILE:
		attributes := credConf.GetResolverAttributes()
		if attributes == nil {
			return nil, fmt.Errorf("attribute should not null")
		}
		profile, exists := attributes[types.KnownCredAttribute_profile.String()]
		if !exists {
			return nil, fmt.Errorf("profile attribute should be exist")
		}
		return azure_service.NewCliAuthConfig(profile)
	default:
		return nil, fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
}

func (s *CredResolveService) GetTencentSdkConfig(credConf *protos.CredResolverConfig) (tcCommon.Provider, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		return tcCommon.NewProviderChain([]tcCommon.Provider{tcCommon.DefaultEnvProvider(), tcCommon.DefaultProfileProvider(), tcCommon.DefaultCvmRoleProvider(), tencent_service.NewTencentIntlProfileProvider("default")}), nil
	case protos.CredentialResolverKind_ENV:
		return tcCommon.DefaultEnvProvider(), nil
	case protos.CredentialResolverKind_IMDS:
		return tcCommon.DefaultCvmRoleProvider(), nil
	case protos.CredentialResolverKind_PROFILE:
		attributes := credConf.GetResolverAttributes()
		if attributes == nil {
			return nil, fmt.Errorf("attribute should not null")
		}
		profile, exists := attributes[types.KnownCredAttribute_profile.String()]
		if !exists {
			return nil, fmt.Errorf("profile attribute should be exist")
		}
		return tencent_service.NewTencentIntlProfileProvider(profile), nil
	default:
		return nil, fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
}

func (s *CredResolveService) GetGcpSdkConfig(ctx context.Context, credConf *protos.CredResolverConfig) (*google.Credentials, string, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		cred, err := gcloudconfig.GetCredentials("")
		if err != nil {
			return nil, "", err
		}
		return cred, "", nil
	case protos.CredentialResolverKind_ENV:
		cred, err := google.FindDefaultCredentials(ctx)
		if err != nil {
			return nil, "", err
		}
		return cred, "", nil
	case protos.CredentialResolverKind_IMDS:
		cred, err := google.FindDefaultCredentials(ctx)
		if err != nil {
			return nil, "", err
		}
		return cred, "", nil
	case protos.CredentialResolverKind_PROFILE:
		attributes := credConf.GetResolverAttributes()
		if attributes == nil {
			return nil, "", fmt.Errorf("attribute should not null")
		}
		profile, exists := attributes[types.KnownCredAttribute_profile.String()]
		if !exists {
			return nil, "", fmt.Errorf("profile attribute should be exist")
		}
		cred, err := gcloudconfig.GetCredentials(profile)
		if err != nil {
			return nil, "", err
		}
		return cred, profile, nil
	default:
		return nil, "", fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
}

func (s *CredResolveService) GetRancherSdkConfig(credConf *protos.CredResolverConfig) (*rancherCfg.ServerConfig, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		cfg, err := rancher_service.LoadConfig()
		if err != nil {
			return nil, err
		}
		return cfg.FocusedServer(), nil
	case protos.CredentialResolverKind_ENV:
		return nil, fmt.Errorf("NotSupportedCredType: ENV")
	case protos.CredentialResolverKind_IMDS:
		return nil, fmt.Errorf("NotSupportedCredType: IMDS")
	case protos.CredentialResolverKind_PROFILE:
		attributes := credConf.GetResolverAttributes()
		if attributes == nil {
			return nil, fmt.Errorf("attribute should not null")
		}
		profile, exists := attributes[types.KnownCredAttribute_profile.String()]
		if !exists {
			return nil, fmt.Errorf("profile attribute should be exist")
		}
		cfg, err := rancher_service.LoadConfig()
		if err != nil {
			return nil, err
		}
		if server, ok := cfg.Servers[profile]; ok {
			return server, nil
		}
		return nil, fmt.Errorf("NotFoundTargetServerConfig: %s", profile)
	default:
		return nil, fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
}

func (s *CredResolveService) SyncCredResolversStatus() error {
	configs := s.credStoreService.ListCredResolverConfigs()
	for _, cfg := range configs {
		if !isRegisteredStatus(cfg.Status) {
			continue
		}

		resolver, exists := s.credStoreService.GetCredResolverInstance(cfg.AccountId)
		if !exists {
			fmt.Printf("GetCredResolverInstanceFailed: Instance Not Exists %s", cfg.AccountId)
			continue
		}

		status, userErr, err := resolver.GetStatus(context.TODO())
		fmt.Printf("UpdateCredResolverConfig: status=%s, userErr:%s, err:%+v\n", status.String(), userErr, err)
		if err != nil {
			return err
		}
		cfg.Status = status
		if userErr != nil {
			cfg.StatusDetail = userErr.Error()
		}
		err = s.credStoreService.SetCredResolverConfig(cfg)
		if err != nil {
			return err
		}
	}
	return nil
}

//고수준 함수만 남겨두고 싶은데
//raw_service로 이전해야 하는지
func isRegisteredStatus(status protos.CredentialResolverStatus) bool {
	return status == protos.CredentialResolverStatus_CRED_REGISTERED_OK || status == protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK
}

func (s *CredResolveService) GetLocalProfiles(infraVendor string) ([]*protos.Profile, error) {
	if strings.EqualFold(infraVendor, types.InfraVendor_AWS.String()) {

	} else if strings.EqualFold(infraVendor, types.InfraVendor_Azure.String()) {

	} else if strings.EqualFold(infraVendor, types.InfraVendor_Tencent.String()) {

	}
	return nil, fmt.Errorf("unknown kind value infraVendor:%s", infraVendor)
}
