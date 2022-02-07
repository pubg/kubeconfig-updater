package tencent_service

import (
	"fmt"
	kuCommon "github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	tke "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke/v20180525"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
)

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
	targetKubeconfig, err := clientcmd.LoadFromFile(kuCommon.GetKubeconfigPath())
	if err != nil {
		return err
	}

	AddNewKubeconfig(newKubeconfig, targetKubeconfig, clusterId, clusterName)

	fmt.Printf("[INFO]: Register TKE{clusterName=%s, clusterId=%s, clusterRegion=%s}\n", clusterName, clusterId, region)

	return nil

}

func AddNewKubeconfig(newKubeconfig *api.Config, targetKubeconfig *api.Config, mergeKey string, contextName string) {
	for _, cluster := range newKubeconfig.Clusters {
		targetKubeconfig.Clusters[mergeKey] = cluster
		break
	}

	for _, authInfo := range newKubeconfig.AuthInfos {
		targetKubeconfig.AuthInfos[mergeKey] = authInfo
		break
	}

	targetKubeconfig.Contexts[contextName] = &api.Context{
		Cluster:  mergeKey,
		AuthInfo: mergeKey,
	}
}
