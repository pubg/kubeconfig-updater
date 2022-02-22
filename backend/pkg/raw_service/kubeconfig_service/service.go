package kubeconfig_service

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"k8s.io/client-go/tools/clientcmd"
)

func GetConfigFilePaths() []string {
	kubeconfigPath := os.Getenv("KUBECONFIG")
	if kubeconfigPath == "" {
		kubeconfigPath = filepath.Join("~", ".kube", "config")
	}
	return strings.Split(kubeconfigPath, string(os.PathListSeparator))
}

// DeleteContext returns: DeleteTargetSuccess, Error
func DeleteContext(contextName string, cascade bool) (bool, error) {
	for _, path := range GetConfigFilePaths() {
		absPath, err := common.ResolvePathToAbs(path)
		if err != nil {
			return false, fmt.Errorf("error occurred while try get absolute path of KUBECONFIG file, error:%s", err.Error())
		}
		cfg, err := clientcmd.LoadFromFile(absPath)
		if err != nil {
			return false, fmt.Errorf("error occurred when trying Kubeconfig/LoadFromFile file:%s error:%s", absPath, err.Error())
		}
		if ctx, exists := cfg.Contexts[contextName]; exists {
			if cascade {
				if _, uExists := cfg.AuthInfos[ctx.AuthInfo]; uExists {
					delete(cfg.AuthInfos, ctx.AuthInfo)
				}
				if _, cExists := cfg.Clusters[ctx.Cluster]; cExists {
					delete(cfg.Clusters, ctx.Cluster)
				}
			}
			delete(cfg.Contexts, contextName)

			err = clientcmd.WriteToFile(*cfg, absPath)
			if err != nil {
				return false, err
			}
			return true, nil
		}
	}
	return false, nil
}
