package cluster_metadata_service

import (
	"fmt"
	"os"
	"testing"
)

func TestFoxResolver_GetCluster(t *testing.T) {
	resolver, err := NewFoxResolver(os.Getenv("FOX_ADDR"))
	if err != nil {
		t.Error(err)
	}

	metadata, exists, err := resolver.GetCluster("central-ea")
	if err != nil {
		t.Error(err)
	}
	if exists {
		fmt.Printf("Found Cluster Metadata\n")
		fmt.Printf("%+v\n", metadata)
	} else {
		t.Errorf("Cluster Metadata is not exists")
	}
}

func TestFoxResolver_ListClusters(t *testing.T) {
	resolver, err := NewFoxResolver(os.Getenv("FOX_ADDR"))
	if err != nil {
		t.Error(err)
	}

	metadatas, err := resolver.ListClusters()
	if err != nil {
		t.Error(err)
	}
	fmt.Printf("Found Cluster Metadata\n")
	for _, metadata := range metadatas {
		fmt.Printf("%+v\n", metadata)
	}
}
