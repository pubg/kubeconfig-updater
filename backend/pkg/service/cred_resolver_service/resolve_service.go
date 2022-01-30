package cred_resolver_service

import (
	"context"
	"fmt"
	"strings"

	"github.com/binxio/gcloudconfig"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/concurrency"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/rancher_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"golang.org/x/oauth2/google"

	"github.com/Azure/go-autorest/autorest/azure/auth"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
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
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		cfg, err := config.LoadDefaultConfig(ctx)
		return &cfg, "", err
	case protos.CredentialResolverKind_ENV:
		cfg, err := config.LoadDefaultConfig(ctx)
		return &cfg, "", err
	case protos.CredentialResolverKind_IMDS:
		cfg, err := config.LoadDefaultConfig(ctx)
		return &cfg, "", err
	case protos.CredentialResolverKind_PROFILE:
		attributes := credConf.GetResolverAttributes()
		if attributes == nil {
			return nil, "", fmt.Errorf("attribute should not null")
		}
		profile, exists := attributes[types.KnownCredAttribute_profile.String()]
		if !exists {
			return nil, "", fmt.Errorf("profile attribute should be exist")
		}
		cfg, err := config.LoadDefaultConfig(ctx, config.WithSharedConfigProfile(profile))
		return &cfg, profile, err
	default:
		return nil, "", fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
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
	credResolvers := s.credStoreService.ListCredResolvers()
	for _, credResolver := range credResolvers {
		if !isRegisteredStatus(credResolver.Status) {
			continue
		}
		status, invalidReason, err := s.getCredResolverStatus(credResolver)
		fmt.Printf("status:%+v,resion:%+v,err:%+v\n", status, invalidReason, err)
		credResolver.Status = status
		credResolver.StatusDetail = invalidReason
		err = s.credStoreService.SetCredResolver(credResolver)
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

// returns: status, invalidReason, error
func (s *CredResolveService) getCredResolverStatus(credConf *protos.CredResolverConfig) (protos.CredentialResolverStatus, string, error) {
	ctx := context.Background()
	vendor := credConf.GetInfraVendor()
	if strings.EqualFold(vendor, types.InfraVendor_AWS.String()) {
		cfg, _, err := s.GetAwsSdkConfig(ctx, credConf)
		if err != nil {
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err.Error(), nil
		}
		_, valid, invalidErr := aws_service.GetConfigInfo(cfg)
		if !valid {
			var reason string
			if invalidErr != nil {
				reason = invalidErr.Error()
			}
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, reason, nil
		}
		return protos.CredentialResolverStatus_CRED_REGISTERED_OK, "", nil
	} else if strings.EqualFold(vendor, types.InfraVendor_Azure.String()) {
		authConfig, err := s.GetAzureSdkConfig(ctx, credConf)
		if err != nil {
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err.Error(), nil
		}
		_, err = authConfig.Authorizer()
		if err != nil {
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err.Error(), nil
		}
		return protos.CredentialResolverStatus_CRED_REGISTERED_OK, "", nil
	} else if strings.EqualFold(vendor, types.InfraVendor_Tencent.String()) {
		credProvider, err := s.GetTencentSdkConfig(credConf)
		if err != nil {
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err.Error(), nil
		}
		_, valid, invalidErr := tencent_service.GetConfigInfo(credProvider)
		if !valid {
			var reason string
			if invalidErr != nil {
				reason = invalidErr.Error()
			}
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, reason, nil
		}
		return protos.CredentialResolverStatus_CRED_REGISTERED_OK, "", nil
	}
	return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, "", fmt.Errorf("not supported infraVendor value %s", credConf.GetInfraVendor())
}

func (s *CredResolveService) GetLocalProfiles(infraVendor string) ([]*protos.Profile, error) {
	if strings.EqualFold(infraVendor, types.InfraVendor_AWS.String()) {
		profileNames, err := aws_service.GetProfiles()
		if err != nil {
			return nil, err
		}

		parallelOuts := concurrency.Parallel(common.ToInterfaceSlice(profileNames), func(in interface{}) (output interface{}, err error) {
			profileName, ok := in.(string)
			if !ok {
				return nil, fmt.Errorf("cannot cast input to string")
			}

			cfg, err := config.LoadDefaultConfig(context.Background(), config.WithSharedConfigProfile(profileName))
			if err != nil {
				return nil, err
			}
			accountIdOrEmpty, _, _ := aws_service.GetConfigInfo(&cfg)
			return &protos.Profile{
				ProfileName: profileName,
				AccountId:   accountIdOrEmpty,
				InfraVendor: types.InfraVendor_AWS.String(),
			}, nil
		})

		var profiles []*protos.Profile
		for _, out := range parallelOuts {
			if out.Err != nil {
				return nil, out.Err
			}
			profiles = append(profiles, out.Output.(*protos.Profile))
		}
		return profiles, nil
	} else if strings.EqualFold(infraVendor, types.InfraVendor_Azure.String()) {
		subscriptions, err := azure_service.GetSubscriptions()
		if err != nil {
			return nil, err
		}
		var profiles []*protos.Profile
		for _, subscription := range subscriptions {
			profiles = append(profiles, &protos.Profile{
				ProfileName: subscription,
				AccountId:   subscription,
				InfraVendor: types.InfraVendor_Azure.String(),
			})
		}
		return profiles, nil
	} else if strings.EqualFold(infraVendor, types.InfraVendor_Tencent.String()) {
		profileNames, err := tencent_service.GetProfiles()
		if err != nil {
			return nil, err
		}

		parallelOuts := concurrency.Parallel(common.ToInterfaceSlice(profileNames), func(in interface{}) (output interface{}, err error) {
			profileName, ok := in.(string)
			if !ok {
				return nil, fmt.Errorf("cannot cast input to string")
			}

			provider := tencent_service.NewTencentIntlProfileProvider(profileName)
			accountIdOrEmpty, _, _ := tencent_service.GetConfigInfo(provider)
			return &protos.Profile{
				ProfileName: profileName,
				AccountId:   accountIdOrEmpty,
				InfraVendor: types.InfraVendor_Tencent.String(),
			}, nil
		})

		var profiles []*protos.Profile
		for _, out := range parallelOuts {
			if out.Err != nil {
				return nil, out.Err
			}
			profiles = append(profiles, out.Output.(*protos.Profile))
		}
		return profiles, nil
	}
	return nil, fmt.Errorf("unknown kind value infraVendor:%s", infraVendor)
}
