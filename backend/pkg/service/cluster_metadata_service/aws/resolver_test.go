package aws

import (
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"testing"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
)

func TestAwsResolver_ListClusters(t *testing.T) {
	accountId := "2222"

	cfg := &protos.CredResolverConfig{
		AccountId:    accountId,
		InfraVendor:  "AWS",
		AccountAlias: "pubg-xtrm",
		Kind:         protos.CredentialResolverKind_PROFILE,
		ResolverAttributes: map[string]string{
			"profile": "mfa",
		},
		Status: protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	}

	factory, exists := credentials.GetFactory(types.InfraVendor_AWS)
	if !exists {
		t.Error("CredResolverFactory NotFound")
	}

	credResolver, err := factory.NewCredResolverFunc(cfg)
	if err != nil {
		t.Error(err)
	}

	resolver, err := NewAwsResolver(credResolver, accountId)
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
