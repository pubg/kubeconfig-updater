package tencent_service

import (
	"encoding/json"
	"github.com/pubg/kubeconfig-updater/backend/internal/types"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	sts "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/sts/v20180813"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/internal/common"
	tcCommon "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
)

func GetProfiles() ([]string, error) {
	// TODO: intl 는 .tccli, china 버전은 .tencentcloud 참조함
	profileNames := make([]string, 0)

	dirPath, err := getCredentialsDirectoryPath()
	if err != nil {
		return nil, err
	}

	dir, err := os.Stat(dirPath)
	if err != nil {
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
	path, err := common.ResolvePathToAbs("~/.tccli")
	return path, err
}

// GetConfigInfo returns: AccountId, CredIsNotValid, error
// CredIsNotValid => config is not valid aws credential
func GetConfigInfo(credProvider tcCommon.Provider) (string, bool, error) {
	cred, err := credProvider.GetCredential()
	if err != nil {
		return "", false, err
	}
	stsClient, err := sts.NewClient(cred, types.TENCENT_DEFAULT_REGION, profile.NewClientProfile())
	if err != nil {
		return "", false, err
	}
	res, err := stsClient.GetCallerIdentity(&sts.GetCallerIdentityRequest{})
	if err != nil {
		return "", false, err
	}
	return *res.Response.AccountId, true, nil
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
