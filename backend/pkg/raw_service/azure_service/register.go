package azure_service

import (
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
)

func RegisterAksCluster(resourceGroup, clusterName string, subscriptionOrEmpty string) error {
	command := fmt.Sprintf("az aks get-credentials --resource-group=%s --name=%s --overwrite-existing", resourceGroup, clusterName)

	if subscriptionOrEmpty != "" {
		command = fmt.Sprintf("%s --subscription=%s", command, subscriptionOrEmpty)
	}

	err := common.SimpleExecute(command, "RegisterClusterFailed")
	if err != nil {
		return err
	}

	if common.IsBinaryExists("kubelogin") {
		err = common.SimpleExecute(fmt.Sprintf("kubelogin convert-kubeconfig -l azurecli"), "ConvertKubeconfigFailed")
		if err != nil {
			return err
		}
	}
	return nil
}
