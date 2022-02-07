package kubeconfig

import (
	"fmt"
	"testing"
)

func TestKubeconfigResolver_ListClusters(t *testing.T) {
	resolver, err := NewKubeconfigResolvers()
	if err != nil {
		t.Error(err)
	}
	fmt.Println("Resolvers")
	for _, r := range resolver {
		fmt.Println(r.GetResolverDescription())
	}

	for _, r := range resolver {
		clusters, err := r.ListClusters()
		if err != nil {
			t.Error(err)
		}
		for _, cluster := range clusters {
			fmt.Printf("%+v\n", cluster)
		}
	}
}
