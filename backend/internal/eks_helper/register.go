package eks_helper

import (
	"errors"
	"fmt"
	"strings"

	"github.krafton.com/xtrm/kubeconfig-updater/internal/common"
)

func RegisterEksWithIamUser(clusterName, clusterRegion, profile string) error {
	command := fmt.Sprintf("aws eks update-kubeconfig --region %[1]s --name %[2]s --alias %[2]s", clusterRegion, clusterName)

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
