package kubeconfig

import (
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/kubeconfig_service"
	"k8s.io/client-go/tools/clientcmd"
)

func init() {
	kubeFactory := &cluster_metadata_service.BasicMetaResolverFactory{FactoryFunc: NewKubeconfigAdapter}
	cluster_metadata_service.RegisterBasicResolverFactories(kubeFactory)
}

type Resolver struct {
	kubeconfigFile string
}

func NewKubeconfigAdapter(ext *configs.Extension) ([]cluster_metadata_service.ClusterMetadataResolver, error) {
	var resolvers []cluster_metadata_service.ClusterMetadataResolver
	for _, path := range kubeconfig_service.GetConfigFilePaths() {
		resolver, err := NewKubeconfigResolver(path)
		if err != nil {
			return nil, err
		}
		resolvers = append(resolvers, resolver)
	}
	return resolvers, nil
}

func NewKubeconfigResolver(path string) (cluster_metadata_service.ClusterMetadataResolver, error) {
	absPath, err := common.ResolvePathToAbs(path)
	if err != nil {
		return nil, fmt.Errorf("error occurred while try get absolute path of KUBECONFIG file, error:%s", err.Error())
	}
	return &Resolver{kubeconfigFile: absPath}, nil
}

func (r *Resolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	cfg, err := clientcmd.LoadFromFile(r.kubeconfigFile)
	if err != nil {
		return nil, fmt.Errorf("error occurred when trying Kubeconfig/LoadFromFile file:%s error:%s", r.kubeconfigFile, err.Error())
	}

	var clusters []*protos.ClusterMetadata
	for name := range cfg.Contexts {
		meta := &protos.ClusterMetadata{
			ClusterName:    name,
			CredResolverId: "",
			ClusterTags:    map[string]string{},
		}
		clusters = append(clusters, meta)
	}
	return clusters, nil
}

func (r *Resolver) GetResolverDescription() string {
	return fmt.Sprintf("Kubeconfig/%+v", strings.Trim(r.kubeconfigFile, "/"))
}
