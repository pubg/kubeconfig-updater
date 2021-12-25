package cred_resolver_service

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"strings"

	"github.com/Azure/go-autorest/autorest/azure/auth"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/types"
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
		profile, exists := attributes[types.CREDRESOLVER_ATTRIBUTE_PROFILE]
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
		profile, exists := attributes[types.CREDRESOLVER_ATTRIBUTE_PROFILE]
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
		profile, exists := attributes[types.CREDRESOLVER_ATTRIBUTE_PROFILE]
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
	if strings.EqualFold(vendor, types.INFRAVENDOR_AWS) {
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
	} else if strings.EqualFold(vendor, types.INFRAVENDOR_Azure) {
		authConfig, err := s.GetAzureSdkConfig(ctx, credConf)
		if err != nil {
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err.Error(), nil
		}
		_, err = authConfig.Authorizer()
		if err != nil {
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err.Error(), nil
		}
		return protos.CredentialResolverStatus_CRED_REGISTERED_OK, "", nil
	} else if strings.EqualFold(vendor, types.INFRAVENDOR_Tencent) {
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
