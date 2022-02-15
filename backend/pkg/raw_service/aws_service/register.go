package aws_service

import (
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
)

// RegisterEks role, profile is optional arguments
func RegisterEks(clusterName, clusterRegion, role, profile string) error {
	command := fmt.Sprintf("aws eks update-kubeconfig --region %[1]s --name %[2]s --alias %[2]s", clusterRegion, clusterName)

	if role != "" {
		command = strings.Join([]string{command, fmt.Sprintf("--role-arn=%s", role)}, " ")
	}

	if profile != "" {
		command = strings.Join([]string{command, fmt.Sprintf("--profile=%s", profile)}, " ")
	}

	err := common.SimpleExecute(command, "RegisterClusterFailed")
	if err != nil {
		return err
	}
	return nil
}
