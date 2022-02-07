package azure_service

import (
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
)

func RegisterAksCluster(resourceGroup, clusterName string, subscriptionOrEmpty string) error {
	command := fmt.Sprintf("az aks get-credentials --resource-group=%s --name=%s --overwrite-existing", resourceGroup, clusterName)

	if subscriptionOrEmpty != "" {
		command = fmt.Sprintf("%s --subscription=%s", command, subscriptionOrEmpty)
	}

	stdout, stderr, exitCode := common.Execute(command)
	if *stdout != "" {
		fmt.Println("STDOUT: " + strings.Trim(*stdout, "\n"))
	}
	if *stderr != "" {
		fmt.Println("STDERR: " + strings.Trim(*stderr, "\n"))
	}
	if exitCode != 0 {
		return fmt.Errorf("RegisterClusterFailed: %s", *stderr)
	}

	if common.IsBinaryExists("kubelogin") {
		stdout, stderr, exitCode = common.Execute(fmt.Sprintf("kubelogin convert-kubeconfig -l azurecli"))
		if *stdout != "" {
			fmt.Println("STDOUT: " + strings.Trim(*stdout, "\n"))
		}
		if *stderr != "" {
			fmt.Println("STDERR: " + strings.Trim(*stderr, "\n"))
		}
		if exitCode != 0 {
			return fmt.Errorf("ConvertKubeconfigFailed: %s", *stderr)
		}
	}
	return nil
}
