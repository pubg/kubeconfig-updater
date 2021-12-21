package cluster_metadata_service

import (
	"fmt"
	"testing"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
)

func TestAwsResolver_ListClusters(t *testing.T) {
	resolver, err := NewAwsResolver(&protos.CredResolverConfig{
		AccountId:    "548322143865",
		InfraVendor:  "AWS",
		AccountAlias: "pubg-xtrm",
		Kind:         protos.CredentialResolverKind_PROFILE,
		ResolverAttributes: map[string]string{
			"profile": "mfa",
		},
		Status: protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	}, "548322143865")
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
