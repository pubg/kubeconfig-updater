package cred_resolver_service

import (
	"context"
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"

	"github.com/Azure/go-autorest/autorest/azure/auth"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
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
		profile, exists := attributes[types.KnownCredAttributes_profile.String()]
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
		profile, exists := attributes[types.KnownCredAttributes_profile.String()]
		if !exists {
			return nil, fmt.Errorf("profile attribute should be exist")
		}
		return azure_service.NewCliAuthConfig(profile)
	default:
		return nil, fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
}

func (s *CredResolveService) GetTencentSdkConfig(credConf *protos.CredResolverConfig) (common.Provider, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		return common.DefaultProviderChain(), nil
	case protos.CredentialResolverKind_ENV:
		return common.DefaultEnvProvider(), nil
	case protos.CredentialResolverKind_IMDS:
		return common.DefaultCvmRoleProvider(), nil
	case protos.CredentialResolverKind_PROFILE:
		attributes := credConf.GetResolverAttributes()
		if attributes == nil {
			return nil, fmt.Errorf("attribute should not null")
		}
		profile, exists := attributes[types.KnownCredAttributes_profile.String()]
		if !exists {
			return nil, fmt.Errorf("profile attribute should be exist")
		}
		return tencent_service.NewTencentIntlProfileProvider(profile), nil
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
		var profiles []*protos.Profile
		for _, profileName := range profileNames {
			cfg, err := config.LoadDefaultConfig(context.Background(), config.WithSharedConfigProfile(profileName))
			if err != nil {
				return nil, err
			}
			accountIdOrEmpty, _, _ := aws_service.GetConfigInfo(&cfg)
			profiles = append(profiles, &protos.Profile{
				ProfileName: profileName,
				AccountId:   accountIdOrEmpty,
				InfraVendor: types.InfraVendor_AWS.String(),
			})
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
		var profiles []*protos.Profile
		for _, profileName := range profileNames {
			provider := tencent_service.NewTencentIntlProfileProvider(profileName)
			accountIdOrEmpty, _, _ := tencent_service.GetConfigInfo(provider)
			profiles = append(profiles, &protos.Profile{
				ProfileName: profileName,
				AccountId:   accountIdOrEmpty,
				InfraVendor: types.InfraVendor_Tencent.String(),
			})
		}
		return profiles, nil
	}
	return nil, fmt.Errorf("unknown kind value infraVendor:%s", infraVendor)
}
