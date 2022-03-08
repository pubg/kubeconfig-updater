package tencent_service

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	sts "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/sts/v20180813"

	tcCommon "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
)

func GetProfiles() ([]string, error) {
	profileNames := make([]string, 0)

	dirPath, err := getCredentialsDirectoryPath()
	if err != nil {
		return nil, err
	}

	dir, err := os.Stat(dirPath)
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	} else if err != nil {
		return nil, err
	} else if !dir.IsDir() {
		return nil, err
	}

	files, err := ioutil.ReadDir(dirPath)
	if err != nil {
		return nil, err
	}

	for _, file := range files {
		name := file.Name()
		ext := ".credential"
		if strings.HasSuffix(name, ext) {
			profileName := strings.TrimSuffix(name, ext)
			profileNames = append(profileNames, profileName)
		}
	}

	return profileNames, nil
}

func getCredentialsDirectoryPath() (string, error) {
	return common.ResolvePathToAbs(filepath.Join("~", ".tccli"))
}

// GetConfigInfo returns: AccountId, error
func GetConfigInfo(credProvider tcCommon.Provider) (string, error) {
	cred, err := credProvider.GetCredential()
	if err != nil {
		return "", err
	}
	stsClient, err := sts.NewClient(cred, types.TENCENT_DEFAULT_REGION, profile.NewClientProfile())
	if err != nil {
		return "", err
	}
	res, err := stsClient.GetCallerIdentity(sts.NewGetCallerIdentityRequest())
	if err != nil {
		return "", err
	}
	return *res.Response.AccountId, nil
}

// TencentIntlProfileProvider China mainland and international cloud's credential file formats are difference
type TencentIntlProfileProvider struct {
	profileName string
}

func NewTencentIntlProfileProvider(profileName string) *TencentIntlProfileProvider {
	return &TencentIntlProfileProvider{profileName: profileName}
}

func (t *TencentIntlProfileProvider) GetCredential() (tcCommon.CredentialIface, error) {
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

	return &tcCommon.Credential{
		SecretId:  rawCred["secretId"].(string),
		SecretKey: rawCred["secretKey"].(string),
	}, nil
}
