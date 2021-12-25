package cred_resolver_service

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"strings"

	"github.com/Azure/go-autorest/autorest"
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
func (s *CredResolveService) GetAzureSdkConfig(ctx context.Context, credConf *protos.CredResolverConfig) (autorest.Authorizer, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		return auth.NewAuthorizerFromCLI()
	case protos.CredentialResolverKind_ENV:
		return auth.NewAuthorizerFromEnvironment()
	case protos.CredentialResolverKind_IMDS:
		return auth.NewMSIConfig().Authorizer()
	case protos.CredentialResolverKind_PROFILE:
		return nil, fmt.Errorf("credentialType=PROFILE is not support for azure credResolver")
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
		if err != nil {
			status = protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK
		}
		credResolver.Status = status
		credResolver.StatusDetail = invalidReason
		err = s.credStoreService.SetCredResolver(credResolver)
		if err != nil {
			return err
		}
	}
	return nil
}

func isRegisteredStatus(status protos.CredentialResolverStatus) bool {
	return status == protos.CredentialResolverStatus_CRED_RESOLVER_UNKNOWN || status == protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK
}

// returns: status, invalidReason, error
func (s *CredResolveService) getCredResolverStatus(credConf *protos.CredResolverConfig) (protos.CredentialResolverStatus, string, error) {
	ctx := context.Background()
	vendor := credConf.GetInfraVendor()
	if strings.EqualFold(vendor, types.INFRAVENDOR_AWS) {
		cfg, _, err := s.GetAwsSdkConfig(ctx, credConf)
		if err != nil {
			return protos.CredentialResolverStatus_CRED_RESOLVER_UNKNOWN, "", err
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
		_, err := s.GetAzureSdkConfig(ctx, credConf)
		if err != nil {
			return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err.Error(), nil
		}
		return protos.CredentialResolverStatus_CRED_REGISTERED_OK, "", nil
	} else if strings.EqualFold(vendor, types.INFRAVENDOR_Tencent) {
		credProvider, err := s.GetTencentSdkConfig(credConf)
		if err != nil {
			return protos.CredentialResolverStatus_CRED_RESOLVER_UNKNOWN, "", err
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
