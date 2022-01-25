package cluster_metadata_service

import (
	"context"
	"fmt"

	"github.com/Azure/go-autorest/autorest/azure/auth"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/arm"
	aks "github.com/Azure/azure-sdk-for-go/services/containerservice/mgmt/2021-10-01/containerservice"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

func NewAzureResolver(credCfg *protos.CredResolverConfig, subscriptionId string, credService *cred_resolver_service.CredResolveService) (*AzureResolver, error) {
	authConfig, err := credService.GetAzureSdkConfig(context.Background(), credCfg)
	if err != nil {
		return nil, err
	}
	return &AzureResolver{
		authConfig:     authConfig,
		subscriptionId: subscriptionId,
	}, nil
}

type AzureResolver struct {
	authConfig     auth.AuthorizerConfig
	subscriptionId string
}

func (r *AzureResolver) GetResolverDescription() string {
	return fmt.Sprintf("Azure/%s", r.subscriptionId)
}

func (r *AzureResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	authorizer, err := r.authConfig.Authorizer()
	if err != nil {
		return nil, err
	}

	client := aks.NewManagedClustersClient(r.subscriptionId)
	client.Authorizer = authorizer

	result, err := client.List(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error occurred when trying AKS/List/ManagedCluster subscriptionId:%s error:%s", r.subscriptionId, err.Error())
	}
	for !result.NotDone() {
		err = result.Next()
		if err != nil {
			return nil, fmt.Errorf("error occurred when trying AKS/List/ManagedCluster subscriptionId:%s error:%s", r.subscriptionId, err.Error())
		}
	}

	var clusters []*protos.ClusterMetadata
	for _, cluster := range result.Values() {
		meta := &protos.ClusterMetadata{
			ClusterName:    *cluster.Name,
			CredResolverId: r.subscriptionId,
			ClusterTags:    map[string]string{},
		}
		resource, err := arm.ParseResourceID(*cluster.ID)
		if err != nil {
			return nil, fmt.Errorf("error occurred when trying parse ResourceId id:%s error:%s", *cluster.ID, err.Error())
		}
		meta.ClusterTags[types.KnownClusterTag_ResourceGroup.String()] = resource.ResourceGroupName
		for key, value := range cluster.Tags {
			meta.ClusterTags[key] = *value
		}
		if _, ok := meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()]; !ok {
			meta.ClusterTags[types.KnownClusterTag_ClusterEngine.String()] = types.KnownClusterEngine_AKS.String()
		}
		clusters = append(clusters, meta)
	}
	return clusters, nil
}
