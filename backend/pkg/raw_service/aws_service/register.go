package aws_service

import (
	"errors"
	"fmt"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
)

// RegisterEksWithIamUser role, profile is optional arguments
func RegisterEksWithIamUser(clusterName, clusterRegion, role, profile string) error {
	command := fmt.Sprintf("aws eks update-kubeconfig --region %[1]s --name %[2]s --alias %[2]s", clusterRegion, clusterName)

	if role != "" {
		command = strings.Join([]string{command, fmt.Sprintf("--role-arn=%s", role)}, " ")
	}

	if profile != "" {
		command = strings.Join([]string{command, fmt.Sprintf("--profile=%s", profile)}, " ")
	}

	out, err, exitCode := common.Execute(command)
	if *out != "" {
		fmt.Println("STDOUT: " + strings.Trim(*out, "\n"))
	}
	if *err != "" {
		fmt.Println("STDERR: " + strings.Trim(*err, "\n"))
	}

	if exitCode != 0 {
		return errors.New("register cluster failed")
	}
	return nil
}
