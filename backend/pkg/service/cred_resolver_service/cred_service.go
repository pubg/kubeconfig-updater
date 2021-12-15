package cred_resolver_service

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.krafton.com/xtrm/kubeconfig-updater/controller/kubeconfig_service/protos"
	"github.krafton.com/xtrm/kubeconfig-updater/pkg/application"
)

func ListCredResolvers() []*protos.CredResolverConfig {
	cfgs := application.GetInstance().CredResolverConfigStorage.ListConfigs()
	return cfgs
}

func GetCredResolver(credResolverId string) (*protos.CredResolverConfig, bool, error) {
	if credResolverId == "" {
		return nil, false, fmt.Errorf("credResolverId should not be empty")
	}

	cfg, exists := application.GetInstance().CredResolverConfigStorage.GetConfig(credResolverId)
	if !exists {
		return nil, false, nil
	}
	return cfg, true, nil
}

func SetCredResolver(cfg *protos.CredResolverConfig) error {
	if cfg == nil {
		return fmt.Errorf("credResolverConfig should not be null")
	}

	return application.GetInstance().CredResolverConfigStorage.SetConfig(cfg)
}

func DeleteCredResolver(credResolverId string) error {
	return application.GetInstance().CredResolverConfigStorage.DeleteConfig(credResolverId)
}

const attribute_profile = "profile"

func GetAwsSdkConfig(ctx context.Context, credConf *protos.CredResolverConfig) (*aws.Config, string, error) {
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
		profile, exists := attributes[attribute_profile]
		if !exists {
			return nil, "", fmt.Errorf("profile attribute should be exist")
		}
		cfg, err := config.LoadDefaultConfig(ctx, config.WithSharedConfigProfile(profile))
		return &cfg, profile, err
	default:
		return nil, "", fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
}

// Azure Cli는 멀티어카운트를 지원하지 않는다
func GetAzureSdkConfig(ctx context.Context, credConf *protos.CredResolverConfig) (string, error) {
	return "", nil
}

func GetTencentSdkConfig(credConf *protos.CredResolverConfig) (common.Provider, error) {
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
		profile, exists := attributes[attribute_profile]
		if !exists {
			return nil, fmt.Errorf("profile attribute should be exist")
		}
		return &TencentIntlProfileProvider{profileName: profile}, nil
	default:
		return nil, fmt.Errorf("unknown kind value %s", credConf.GetKind())
	}
}

// 중국 본토랑 intl이랑 credentials 포맷이 다름
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
