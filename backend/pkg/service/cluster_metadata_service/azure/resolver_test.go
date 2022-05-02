package azure

import (
	"fmt"
	"os"
	"testing"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	azureCred "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/azure"
)

func TestResolver_ListClusters(t *testing.T) {
	accountId := os.Getenv("AZ_SUBSCRIPTION_ID")

	cfg := &protos.CredResolverConfig{
		AccountId:    accountId,
		InfraVendor:  "Azure",
		AccountAlias: "xtrm-newstate",
		Kind:         protos.CredentialResolverKind_PROFILE,
		ResolverAttributes: map[string]string{
			"profile": accountId,
		},
		Status: protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	}

	credResolver, err := azureCred.NewAzureResolver(cfg)
	if err != nil {
		t.Error(err)
	}

	resolver, err := NewAzureResolver(credResolver, accountId)
	if err != nil {
		t.Error(err)
	}

	metadatas, err := resolver.ListClusters()
	if err != nil {
		t.Error(err)
	}
	fmt.Printf("Found Cluster Metadatas %d\n", len(metadatas))
	for _, metadata := range metadatas {
		fmt.Printf("%+v\n", metadata)
	}
}
