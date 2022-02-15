package gcp_service

import (
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
)

func RegisterGkeCluster(zone string, clusterName string, configurationName string) error {
	command := fmt.Sprintf("gcloud container clusters get-credentials %s --zone=%s", clusterName, zone)
	if configurationName != "" {
		command = strings.Join([]string{command, fmt.Sprintf("--configuration=%s", configurationName)}, " ")
	}

	err := common.SimpleExecute(command, "RegisterClusterFailed")
	if err != nil {
		return err
	}
	return nil
}
