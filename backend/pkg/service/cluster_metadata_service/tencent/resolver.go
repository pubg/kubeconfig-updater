package tencent

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/errors"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	cvm "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/cvm/v20170312"
	tke "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke/v20180525"
)

func init() {
	factory := &cluster_metadata_service.CloudMetaResolverFactory{FactoryFunc: NewTencentResolver}
	if err := cluster_metadata_service.RegisterCloudResolverFactory(types.InfraVendor_Tencent, factory); err != nil {
		log.Fatalln(err)
	}
}

type Resolver struct {
	credProvider common.Provider
	tcAccountId  string
}

func NewTencentResolver(cred credentials.CredResolver, accountId string) (cluster_metadata_service.ClusterMetadataResolver, error) {
	rawProvider, _, err := cred.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, err
	}

	return &Resolver{
		credProvider: rawProvider.(common.Provider),
		tcAccountId:  accountId,
	}, nil
}

func (r *Resolver) GetResolverDescription() string {
	return fmt.Sprintf("Tencent/%s", r.tcAccountId)
}

func (r *Resolver) ListClusters() ([]*protos.ClusterMetadata, error) {
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

func (r *Resolver) listTkeFuture(region string) <-chan listTkeFutureOut {
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

func (r *Resolver) listTke(region string) ([]*protos.ClusterMetadata, error) {
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

		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterRegion.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterRegion.String()] = region
		}
		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()] = types.KnownClusterEngine_TKE.String()
		}

		clusters = append(clusters, meta)
	}
	return clusters, nil
}
