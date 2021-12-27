package azure_service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/Azure/go-autorest/autorest"
	"github.com/Azure/go-autorest/autorest/azure/auth"
	cli "github.com/Azure/go-autorest/autorest/azure/cli"
	"os"
	"os/exec"
	"regexp"
	"runtime"
)

func NewEnvAuthConfig() (*EnvAuthConfig, error) {
	envInstance, err := auth.GetSettingsFromEnvironment()
	if err != nil {
		return nil, err
	}
	return &EnvAuthConfig{instance: envInstance}, nil
}

type EnvAuthConfig struct {
	instance auth.EnvironmentSettings
}

func (e *EnvAuthConfig) Authorizer() (autorest.Authorizer, error) {
	return e.instance.GetAuthorizer()
}

// NewCliAuthConfig subscription support empty string
func NewCliAuthConfig(subscription string) (*CliAuthConfig, error) {
	settings, err := auth.GetSettingsFromEnvironment()
	if err != nil {
		return nil, err
	}
	if settings.Values[auth.Resource] == "" {
		settings.Values[auth.Resource] = settings.Environment.ResourceManagerEndpoint
	}
	return &CliAuthConfig{subscription: subscription, resource: settings.Values[auth.Resource]}, nil
}

type CliAuthConfig struct {
	subscription string
	resource     string
}

func (c *CliAuthConfig) Authorizer() (autorest.Authorizer, error) {
	token, err := GetTokenFromCLI(c.resource, c.subscription)
	if err != nil {
		return nil, err
	}

	adalToken, err := token.ToADALToken()
	if err != nil {
		return nil, err
	}

	return autorest.NewBearerAuthorizer(&adalToken), nil
}

// Get Codes from github.com/azure/go-autorest/autorest/azure/cli/token.go
// GetTokenFromCLI gets a token using Azure CLI 2.0 for local development scenarios.
func GetTokenFromCLI(resource string, subscription string) (*cli.Token, error) {
	// Validate resource, since it gets sent as a command line argument to Azure CLI
	const invalidResourceErrorTemplate = "Resource %s is not in expected format. Only alphanumeric characters, [dot], [colon], [hyphen], and [forward slash] are allowed."
	match, err := regexp.MatchString("^[0-9a-zA-Z-.:/]+$", resource)
	if err != nil {
		return nil, err
	}
	if !match {
		return nil, fmt.Errorf(invalidResourceErrorTemplate, resource)
	}

	cliCmd := GetAzureCliRunner()
	cliCmd.Args = append(cliCmd.Args, "account", "get-access-token", "-o", "json", "--resource", resource)
	if subscription != "" {
		cliCmd.Args = append(cliCmd.Args, "--subscription", subscription)
	}

	var stderr bytes.Buffer
	cliCmd.Stderr = &stderr

	output, err := cliCmd.Output()
	if err != nil {
		return nil, fmt.Errorf("Invoking Azure CLI failed with the following error: %s", stderr.String())
	}

	tokenResponse := cli.Token{}
	err = json.Unmarshal(output, &tokenResponse)
	if err != nil {
		return nil, err
	}

	return &tokenResponse, err
}

func GetSubscriptions() ([]string, error) {
	cliCmd := GetAzureCliRunner()
	cliCmd.Args = append(cliCmd.Args, "account", "list", "--query", "[].id", "--output", "json")

	var stderr bytes.Buffer
	cliCmd.Stderr = &stderr

	output, err := cliCmd.Output()
	if err != nil {
		return nil, fmt.Errorf("Invoking Azure CLI failed with the following error: %s", stderr.String())
	}

	var subscriptions []string
	err = json.Unmarshal(output, &subscriptions)
	if err != nil {
		return nil, err
	}

	return subscriptions, err
}

func GetAzureCliRunner() *exec.Cmd {
	// This is the path that a developer can set to tell this class what the install path for Azure CLI is.
	const azureCLIPath = "AzureCLIPath"

	// The default install paths are used to find Azure CLI. This is for security, so that any path in the calling program's Path environment is not used to execute Azure CLI.
	azureCLIDefaultPathWindows := fmt.Sprintf("%s\\Microsoft SDKs\\Azure\\CLI2\\wbin; %s\\Microsoft SDKs\\Azure\\CLI2\\wbin", os.Getenv("ProgramFiles(x86)"), os.Getenv("ProgramFiles"))

	// Default path for non-Windows.
	const azureCLIDefaultPath = "/bin:/sbin:/usr/bin:/usr/local/bin"

	var cliCmd *exec.Cmd
	if runtime.GOOS == "windows" {
		cliCmd = exec.Command(fmt.Sprintf("%s\\system32\\cmd.exe", os.Getenv("windir")))
		cliCmd.Env = os.Environ()
		cliCmd.Env = append(cliCmd.Env, fmt.Sprintf("PATH=%s;%s", os.Getenv(azureCLIPath), azureCLIDefaultPathWindows))
		cliCmd.Args = append(cliCmd.Args, "/c", "az")
	} else {
		cliCmd = exec.Command("az")
		cliCmd.Env = os.Environ()
		cliCmd.Env = append(cliCmd.Env, fmt.Sprintf("PATH=%s:%s", os.Getenv(azureCLIPath), azureCLIDefaultPath))
	}
	return cliCmd
}
