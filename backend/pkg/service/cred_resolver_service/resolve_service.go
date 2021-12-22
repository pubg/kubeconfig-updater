package cred_resolver_service

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/Azure/go-autorest/autorest"
	"github.com/Azure/go-autorest/autorest/azure/auth"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/types"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
)

type CredResolveService struct {
}

func NewCredResolveService() *CredResolveService {
	return &CredResolveService{}
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
		return &TencentIntlProfileProvider{profileName: profile}, nil
	default:
		return nil, fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
}

// TencentIntlProfileProvider China mainland and international cloud's credential file formats are difference
type TencentIntlProfileProvider struct {
	profileName string
}

func (t *TencentIntlProfileProvider) GetCredential() (common.CredentialIface, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}

	credentialFilePath := filepath.Join(home, ".tccli", t.profileName+".credential")

	buf, err := os.ReadFile(credentialFilePath)
	if err != nil {
		return nil, err
	}

	rawCred := map[string]interface{}{}
	err = json.Unmarshal(buf, &rawCred)
	if err != nil {
		return nil, err
	}

	return &common.Credential{
		SecretId:  rawCred["secretId"].(string),
		SecretKey: rawCred["secretKey"].(string),
	}, nil
}
