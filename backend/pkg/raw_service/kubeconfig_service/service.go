package kubeconfig_service

import (
	"os"
	"path/filepath"
	"strings"
)

func GetConfigFilePaths() []string {
	kubeconfigPath := os.Getenv("KUBECONFIG")
	if kubeconfigPath == "" {
		kubeconfigPath = filepath.Join("~", ".kube", "config")
	}
	return strings.Split(kubeconfigPath, string(os.PathListSeparator))
}

func DeleteContext(contextName string, cascade bool) {

}
