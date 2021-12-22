package tencent_service

import (
	"fmt"
	"log"
	"os"
	"path"

	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	tke "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke/v20180525"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
)

func getKubeconfigPath() string {
	home, err := os.UserHomeDir()
	if err != nil {
		log.Fatalln(err)
	}
	return path.Join(home, "/.kube/config")
}

func RegisterTkeCluster(region, clusterId, clusterName string, profileName string) error {
	credProviders := common.NewProviderChain([]common.Provider{common.DefaultEnvProvider(), NewTencentIntlProfileProvider(profileName), common.DefaultProfileProvider(), common.DefaultCvmRoleProvider()})
	return RegisterTkeCluster0(region, clusterId, clusterName, credProviders)
}

func RegisterTkeCluster0(region, clusterId, clusterName string, credProvider common.Provider) error {
	cred, err := credProvider.GetCredential()
	if err != nil {
		return err
	}

	client, err := tke.NewClient(cred, region, profile.NewClientProfile())
	if err != nil {
		return err
	}

	req := tke.NewDescribeClusterKubeconfigRequest()
	req.ClusterId = common.StringPtr(clusterId)
	res, err := client.DescribeClusterKubeconfig(req)
	if err != nil {
		return err
	}

	config := res.Response.Kubeconfig
	newKubeconfig, err := clientcmd.Load([]byte(*config))
	if err != nil {
		return err
	}

	oldKubeconfig, err := clientcmd.LoadFromFile(getKubeconfigPath())
	if err != nil {
		return err
	}

	// 텐센트에서 내려주는 key가 unique하지 않음, 따라서 그냥 머지시 마지막에 작업한 key로 덮어씌워지므로 key는 clusterId로 변경함
	for _, cluster := range newKubeconfig.Clusters {
		oldKubeconfig.Clusters[clusterId] = cluster
		break
	}

	for _, authInfo := range newKubeconfig.AuthInfos {
		oldKubeconfig.AuthInfos[clusterId] = authInfo
		break
	}

	oldKubeconfig.Contexts[clusterName] = &api.Context{
		Cluster:  clusterId,
		AuthInfo: clusterId,
	}

	oldKubeconfig.CurrentContext = clusterName

	err = clientcmd.WriteToFile(*oldKubeconfig, getKubeconfigPath())
	if err != nil {
		return err
	}

	fmt.Printf("[INFO]: Register TKE{clusterName=%s, clusterId=%s, clusterRegion=%s}\n\n", clusterName, clusterId, region)

	return nil

}
