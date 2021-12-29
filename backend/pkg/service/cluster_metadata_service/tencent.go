package cluster_metadata_service

import (
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/errors"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	cvm "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/cvm/v20170312"
	tke "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke/v20180525"
)

func NewTencentResolver(credCfg *protos.CredResolverConfig, accountId string, credService *cred_resolver_service.CredResolveService) (*TencentResolver, error) {
	credProvider, err := credService.GetTencentSdkConfig(credCfg)
	if err != nil {
		return nil, err
	}
	return &TencentResolver{
		credProvider: credProvider,
		tcAccountId:  accountId,
	}, nil
}

type TencentResolver struct {
	credProvider common.Provider
	tcAccountId  string
}

func (r *TencentResolver) GetResolverDescription() string {
	return fmt.Sprintf("Tencent/%s", r.tcAccountId)
}

func (r *TencentResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	cred, err := r.credProvider.GetCredential()
	if err != nil {
		return nil, err
	}
	cvmClient, err := cvm.NewClient(cred, types.TENCENT_DEFAULT_REGION, profile.NewClientProfile())
	if err != nil {
		return nil, err
	}

	regionsOut, err := cvmClient.DescribeRegions(cvm.NewDescribeRegionsRequest())
	if err != nil {
		return nil, err
	}

	var futures []<-chan listTkeFutureOut
	for _, region := range regionsOut.Response.RegionSet {
		if *region.RegionState == "AVAILABLE" {
			future := r.listTkeFuture(*region.Region)
			futures = append(futures, future)
		}
	}
	var clusters []*protos.ClusterMetadata
	for _, future := range futures {
		out := <-future
		if out.err != nil {
			return nil, out.err
		}
		clusters = append(clusters, out.clusters...)
	}

	return clusters, nil
}

type listTkeFutureOut struct {
	clusters []*protos.ClusterMetadata
	err      error
}

func (r *TencentResolver) listTkeFuture(region string) <-chan listTkeFutureOut {
	c := make(chan listTkeFutureOut, 1)
	go func() {
		clusters, err := r.listTke(region)
		c <- listTkeFutureOut{
			clusters: clusters,
			err:      err,
		}
		close(c)
	}()
	return c
}

func (r *TencentResolver) listTke(region string) ([]*protos.ClusterMetadata, error) {
	cred, err := r.credProvider.GetCredential()
	if err != nil {
		return nil, err
	}
	tkeClient, err := tke.NewClient(cred, region, profile.NewClientProfile())
	if err != nil {
		return nil, err
	}
	clustersOut, err := tkeClient.DescribeClusters(tke.NewDescribeClustersRequest())
	if err != nil {
		if tcErr, ok := err.(*errors.TencentCloudSDKError); ok && tcErr.GetCode() == "UnsupportedRegion" {
			fmt.Printf("Skip TKE/DescribeClusters to accountId:%s, region:%s, Reason: UnsupportedRegion\n", r.tcAccountId, region)
			return []*protos.ClusterMetadata{}, nil
		}
		return nil, fmt.Errorf("error occurred when trying TKE/DescribeClusters accountId:%s region:%s, error:%s", r.tcAccountId, region, err.Error())
	}

	var clusters []*protos.ClusterMetadata
	for _, cluster := range clustersOut.Response.Clusters {
		meta := &protos.ClusterMetadata{
			ClusterName:    *cluster.ClusterName,
			CredResolverId: r.tcAccountId,
			ClusterTags:    map[string]string{},
		}
		meta.ClusterTags[types.KnownClusterTag_ClusterId.String()] = *cluster.ClusterId
		for _, tagSpec := range cluster.TagSpecification {
			for _, tag := range tagSpec.Tags {
				meta.ClusterTags[*tag.Key] = *tag.Value
			}
		}
		clusters = append(clusters, meta)
	}
	return clusters, nil
}
