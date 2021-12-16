package cluster_metadata_service

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

func NewAwsResolver(credCfg *protos.CredResolverConfig, accountId string) (*AwsResolver, error) {
	awsCfg, _, err := cred_resolver_service.GetAwsSdkConfig(context.Background(), credCfg)
	if err != nil {
		return nil, err
	}
	return &AwsResolver{
		awsConfig:    awsCfg,
		awsAccountId: accountId,
	}, nil
}

type AwsResolver struct {
	awsConfig    *aws.Config
	awsAccountId string
}

func (r *AwsResolver) GetResolverDescription() string {
	return fmt.Sprintf("AWS/%s", r.awsAccountId)
}

func (r *AwsResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	copiedCfg := r.awsConfig.Copy()
	copiedCfg.Region = "us-east-1"
	ec2Client := ec2.NewFromConfig(copiedCfg)

	ctx := context.Background()
	regionsOut, err := ec2Client.DescribeRegions(ctx, &ec2.DescribeRegionsInput{
		AllRegions: aws.Bool(false),
	})
	if err != nil {
		return nil, err
	}

	var futures []<-chan listEksFutureOut
	for _, region := range regionsOut.Regions {
		future := r.listEksFuture(*region.RegionName)
		futures = append(futures, future)
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

type listEksFutureOut struct {
	clusters []*protos.ClusterMetadata
	err      error
}

func (r *AwsResolver) listEksFuture(region string) <-chan listEksFutureOut {
	c := make(chan listEksFutureOut, 1)
	go func() {
		clusters, err := r.listEks(region)
		c <- listEksFutureOut{
			clusters: clusters,
			err:      err,
		}
		close(c)
	}()
	return c
}

func (r *AwsResolver) listEks(region string) ([]*protos.ClusterMetadata, error) {
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

		clusters = append(clusters, meta)
	}
	return clusters, nil
}

func (r *AwsResolver) GetResolverType() protos.MetadataResolverType {
	return protos.MetadataResolverType_CRED_RESOLVER
}
