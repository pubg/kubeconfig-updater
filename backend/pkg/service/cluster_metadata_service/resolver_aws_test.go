package cluster_metadata_service

import (
	"fmt"
	"testing"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

func TestAwsResolver_ListClusters(t *testing.T) {
	accountId := "2222"

	resolver, err := NewAwsResolver(&protos.CredResolverConfig{
		AccountId:    accountId,
		InfraVendor:  "AWS",
		AccountAlias: "pubg-xtrm",
		Kind:         protos.CredentialResolverKind_PROFILE,
		ResolverAttributes: map[string]string{
			"profile": "mfa",
		},
		Status: protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	}, accountId, &cred_resolver_service.CredResolveService{})
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
