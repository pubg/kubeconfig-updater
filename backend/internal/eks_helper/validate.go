package eks_helper

import (
	"fmt"
	"github.com/tidwall/gjson"
	"github.krafton.com/xtrm/kubeconfig-updater/internal/common"
)

func GetAccountIdOfProfileFromAWS(profileName string) (string, error) {
	if profileName == "" {
		return "", fmt.Errorf("profileName is empty")
	}

	command := fmt.Sprintf("aws sts get-caller-identity --profile=%s --output=json", profileName)

	out, err, exitCode := common.Execute(command)

	if exitCode != 0 {
		fmt.Printf("STDERR: %s\n", *err)
		return "", fmt.Errorf("unexpected exit code: %d", exitCode)
	}

	// if exit code is 0, then the out is json value
	result := gjson.Get(*out, "Account")
	accountId := result.String()

	return accountId, nil
}
