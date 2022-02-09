package rancher_service

import (
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	managementClient "github.com/rancher/rancher/pkg/client/generated/management/v3"
	"k8s.io/client-go/tools/clientcmd"
)

func RegisterRancherCluster(mc *managementClient.Client, clusterId string) error {
	cluster, err := mc.Cluster.ByID(clusterId)
	if err != nil {
		return fmt.Errorf("no cluster found with the ID [%s], run `rancher clusters` to see available clusters: %s", clusterId, err)
	}

	out, err := mc.Cluster.ActionGenerateKubeconfig(cluster)
	if err != nil {
		return err
	}

	newKubeconfig, err := clientcmd.Load([]byte(out.Config))
	if err != nil {
		return err
	}
	targetKubeconfig, err := clientcmd.LoadFromFile(common.GetKubeconfigPath())
	if err != nil {
		return err
	}

	tencent_service.AddNewKubeconfig(newKubeconfig, targetKubeconfig, clusterId, cluster.Name)

	err = clientcmd.WriteToFile(*targetKubeconfig, common.GetKubeconfigPath())
	if err != nil {
		return err
	}

	fmt.Printf("[INFO]: Register Rancher{clusterName=%s, clusterId=%s}\n", cluster.Name, clusterId)

	return nil
}
