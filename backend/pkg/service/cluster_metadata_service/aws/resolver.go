package aws

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/concurrency"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	awsTypes "github.com/aws/aws-sdk-go-v2/service/ec2/types"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
)

func init() {
	factory := &cluster_metadata_service.CloudMetaResolverFactory{FactoryFunc: NewAwsResolver}
	if err := cluster_metadata_service.RegisterCloudResolverFactory(types.InfraVendor_AWS, factory); err != nil {
		log.Fatalln(err)
	}
}

type Resolver struct {
	awsConfig    *aws.Config
	awsAccountId string
}

func NewAwsResolver(cred credentials.CredResolver, accountId string) (cluster_metadata_service.ClusterMetadataResolver, error) {
	awsCfg, _, err := cred.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, err
	}
	return &Resolver{
		awsConfig:    awsCfg.(*aws.Config),
		awsAccountId: accountId,
	}, nil
}

func (r *Resolver) GetResolverDescription() string {
	return fmt.Sprintf("AWS/%s", r.awsAccountId)
}

func (r *Resolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	copiedCfg := r.awsConfig.Copy()
	copiedCfg.Region = types.AWS_DEFAULT_REGION
	ec2Client := ec2.NewFromConfig(copiedCfg)

	ctx := context.Background()
	regionsOut, err := ec2Client.DescribeRegions(ctx, &ec2.DescribeRegionsInput{
		AllRegions: aws.Bool(false),
	})
	if err != nil {
		return nil, err
	}

	clustersOut := concurrency.Parallel(common.ToInterfaceSlice(regionsOut.Regions), func(in interface{}) (output interface{}, err error) {
		region, ok := in.(awsTypes.Region)
		if !ok {
			return nil, common.TypeCastError("ec2/types/Region")
		}
		return r.listEks(*region.RegionName)
	})

	var clusters []*protos.ClusterMetadata
	for _, out := range clustersOut {
		region, ok := out.Input.(awsTypes.Region)
		if !ok {
			return nil, common.TypeCastError("ec2/types/Region")
		}

		if out.Err != nil {
			fmt.Printf("failed to list clusters from region %s, error: %s", *region.RegionName, out.Err)
		} else {
			regionalClusters := out.Output.([]*protos.ClusterMetadata)
			if !ok {
				return nil, common.TypeCastError("ClusterMetadata")
			}

			clusters = append(clusters, regionalClusters...)
		}
	}
	return clusters, nil
}

func (r *Resolver) listEks(region string) ([]*protos.ClusterMetadata, error) {
	copiedCfg := r.awsConfig.Copy()
	copiedCfg.Region = region
	eksClient := eks.NewFromConfig(copiedCfg)

	listclusterOut, err := eksClient.ListClusters(context.Background(), &eks.ListClustersInput{})
	if err != nil {
		return nil, fmt.Errorf("error occurred when trying EKS/ListClusters accountId:%s region:%s, error:%s", r.awsAccountId, region, err.Error())
	}

	var clusters []*protos.ClusterMetadata
	for _, clusterName := range listclusterOut.Clusters {
		meta := &protos.ClusterMetadata{}
		meta.ClusterName = clusterName
		meta.CredResolverId = r.awsAccountId

		clusterOut, err := eksClient.DescribeCluster(context.Background(), &eks.DescribeClusterInput{Name: aws.String(clusterName)})
		if err != nil {
			return nil, fmt.Errorf("error occurred when trying EKS/DescribeCluster accountId:%s region:%s cluster-name:%s, error:%s", r.awsAccountId, region, clusterName, err.Error())
		}
		meta.ClusterTags = clusterOut.Cluster.Tags

		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterRegion.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterRegion.String()] = region
		}

		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()] = types.KnownClusterEngine_EKS.String()
		}

		clusters = append(clusters, meta)
	}
	return clusters, nil
}
