package tke_helper

import (
	"encoding/json"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	"os"
	"path/filepath"
)
import tke "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke/v20180525"

// 중국 본토랑 intl이랑 credentials 포맷이 다름
type TencentIntlProfileProvider struct {
	profileName string
}

func NewTencentIntlProfileProvider(profileName string) *TencentIntlProfileProvider {
	provider := &TencentIntlProfileProvider{}

	if profileName != "" {
		provider.profileName = profileName
	} else {
		provider.profileName = "default"
	}

	return provider
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

func ListTke(region string, profileName string) ([]*tke.Cluster, error) {
	credProviders := common.NewProviderChain([]common.Provider{common.DefaultEnvProvider(), NewTencentIntlProfileProvider(profileName), common.DefaultProfileProvider(), common.DefaultCvmRoleProvider()})
	cred, err := credProviders.GetCredential()
	if err != nil {
		return nil, err
	}

	client, err := tke.NewClient(cred, region, profile.NewClientProfile())
	if err != nil {
		return nil, err
	}

	clustersOut, err := client.DescribeClusters(tke.NewDescribeClustersRequest())
	if err != nil {
		return nil, err
	}
	return clustersOut.Response.Clusters, nil
}
