package tencent_service

import (
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
)
import tke "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke/v20180525"

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
