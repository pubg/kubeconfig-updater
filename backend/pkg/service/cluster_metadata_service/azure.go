package cluster_metadata_service

import (
	"context"
	"fmt"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/arm"
	aks "github.com/Azure/azure-sdk-for-go/services/containerservice/mgmt/2021-10-01/containerservice"
	"github.com/Azure/go-autorest/autorest"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/api/types"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

func NewAzureResolver(credCfg *protos.CredResolverConfig, tenantId string, credService *cred_resolver_service.CredResolverService) (*AzureResolver, error) {
	auth, err := credService.GetAzureSdkConfig(context.Background(), credCfg)
	if err != nil {
		return nil, err
	}
	return &AzureResolver{
		auth:     auth,
		tenantId: tenantId,
	}, nil
}

type AzureResolver struct {
	auth     autorest.Authorizer
	tenantId string
}

func (r *AzureResolver) GetResolverDescription() string {
	return fmt.Sprintf("Azure/%s", r.tenantId)
}

func (r *AzureResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	client := aks.NewManagedClustersClient(r.tenantId)
	client.Authorizer = r.auth
	result, err := client.List(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error occurred when trying AKS/List/ManagedCluster tenantId:%s error:%s", r.tenantId, err.Error())
	}
	for !result.NotDone() {
		err = result.Next()
		if err != nil {
			return nil, fmt.Errorf("error occurred when trying AKS/List/ManagedCluster tenantId:%s error:%s", r.tenantId, err.Error())
		}
	}

	var clusters []*protos.ClusterMetadata
	for _, cluster := range result.Values() {
		meta := &protos.ClusterMetadata{
			ClusterName:    *cluster.Name,
			CredResolverId: r.tenantId,
			ClusterTags:    map[string]string{},
		}
		resource, err := arm.ParseResourceID(*cluster.ID)
		if err != nil {
			return nil, fmt.Errorf("error occurred when trying parse ResourceId id:%s error:%s", *cluster.ID, err.Error())
		}
		meta.ClusterTags[types.CLUSTERTAGS_ResourceGroup] = resource.ResourceGroupName
		for key, value := range cluster.Tags {
			meta.ClusterTags[key] = *value
		}
		clusters = append(clusters, meta)
	}
	return clusters, nil
}
