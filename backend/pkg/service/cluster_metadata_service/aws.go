package cluster_metadata_service

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

func NewAwsResolver(credCfg *protos.CredResolverConfig) (*AwsResolver, error) {
	awsCfg, _, err := cred_resolver_service.GetAwsSdkConfig(context.Background(), credCfg)
	if err != nil {
		return nil, err
	}
	return &AwsResolver{
		awsConfig: awsCfg,
	}, nil
}

type AwsResolver struct {
	awsConfig *aws.Config
}

func (a *AwsResolver) GetCluster(clusterName string) (*protos.ClusterMetadata, bool, error) {
	panic("implement me")
}

func (a *AwsResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	copiedCfg := a.awsConfig.Copy()
	copiedCfg.Region = "us-east-1"
	ec2Client := ec2.NewFromConfig(copiedCfg)

	ctx := context.Background()
	_, err := ec2Client.DescribeRegions(ctx, &ec2.DescribeRegionsInput{
		AllRegions: aws.Bool(true),
	})
	if err != nil {
		return nil, err
	}
	return nil, err
}

func (a *AwsResolver) GetResolverType() protos.MetadataResolverType {
	return protos.MetadataResolverType_CRED_RESOLVER
}
