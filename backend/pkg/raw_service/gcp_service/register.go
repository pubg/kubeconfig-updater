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

	out, err, exitCode := common.Execute(command)
	if *out != "" {
		fmt.Println("STDOUT: " + strings.Trim(*out, "\n"))
	}
	if *err != "" {
		fmt.Println("STDERR: " + strings.Trim(*err, "\n"))
	}

	if exitCode != 0 {
		return fmt.Errorf("RegisterClusterFailed: %s", *err)
	}
	return nil
}
