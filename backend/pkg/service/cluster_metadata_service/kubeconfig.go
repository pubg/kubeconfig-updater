package cluster_metadata_service

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/common"
	"k8s.io/client-go/tools/clientcmd"
)

func NewKubeconfigResolvers() ([]*KubeconfigResolver, error) {
	kubeconfigPath := os.Getenv("KUBECONFIG")
	if kubeconfigPath == "" {
		kubeconfigPath = filepath.Join("~", ".kube", "config")
	}
	paths := strings.Split(kubeconfigPath, string(os.PathListSeparator))

	var resolvers []*KubeconfigResolver
	for _, path := range paths {
		absPath, err := common.ResolvePathToAbs(path)
		if err != nil {
			return nil, fmt.Errorf("error occurred try split KUBECONFIG file paths error:%s", err.Error())
		}
		resolvers = append(resolvers, &KubeconfigResolver{kubeconfigFile: absPath})
	}
	return resolvers, nil
}

type KubeconfigResolver struct {
	kubeconfigFile string
}

func (r *KubeconfigResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	cfg, err := clientcmd.LoadFromFile(r.kubeconfigFile)
	if err != nil {
		return nil, fmt.Errorf("error occurred when trying Kubeconfig/LoadFromFile file:%s error:%s", r.kubeconfigFile, err.Error())
	}

	var clusters []*protos.ClusterMetadata
	for name, _ := range cfg.Contexts {
		meta := &protos.ClusterMetadata{
			ClusterName: name,
			CredResolverId: "",
			ClusterTags: map[string]string{},
		}
		clusters = append(clusters, meta)
	}
	return clusters, nil
}

func (r *KubeconfigResolver) GetResolverDescription() string {
	return fmt.Sprintf("Kubeconfig/%+v", r.kubeconfigFile)
}
