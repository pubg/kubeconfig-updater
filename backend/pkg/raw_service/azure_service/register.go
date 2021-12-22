package azure_service

import (
	"errors"
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/internal/common"
)

func RegisterAksCluster(resourceGroup, clusterName string) error {
	command := fmt.Sprintf("az aks get-credentials --resource-group=%s --name=%s --overwrite-existing", resourceGroup, clusterName)
	stdout, stderr, exitCode := common.Execute(command)
	if *stdout != "" {
		fmt.Println("STDOUT: " + strings.Trim(*stdout, "\n"))
	}
	if *stderr != "" {
		fmt.Println("STDERR: " + strings.Trim(*stderr, "\n"))
	}
	if exitCode != 0 {
		return errors.New("register cluster failed")
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
			return errors.New("convert kubeconfig failed")
		}
	}
	return nil
}
