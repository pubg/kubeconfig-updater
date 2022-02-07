package rancher_service

import (
	"strings"
	"time"

	"github.com/rancher/cli/config"
	"github.com/rancher/norman/clientbase"
	capiClient "github.com/rancher/rancher/pkg/client/generated/cluster/v1alpha4"
	managementClient "github.com/rancher/rancher/pkg/client/generated/management/v3"
)

func NewManagementClient(config *config.ServerConfig, timeout time.Duration) (*managementClient.Client, error) {
	options := createClientOpts(config, timeout)

	// Setup the management client
	mClient, err := managementClient.NewClient(options)
	if err != nil {
		return nil, err
	}

	return mClient, nil
}

func NewCAPIClient(config *config.ServerConfig, timeout time.Duration) (*capiClient.Client, error) {
	options := createClientOpts(config, timeout)
	options.URL = strings.TrimSuffix(options.URL, "/v3") + "/v1"

	// Setup the CAPI client
	cc, err := capiClient.NewClient(options)
	if err != nil {
		return nil, err
	}
	return cc, nil
}

func createClientOpts(config *config.ServerConfig, timeout time.Duration) *clientbase.ClientOpts {
	serverURL := config.URL

	if !strings.HasSuffix(serverURL, "/v3") {
		serverURL = config.URL + "/v3"
	}

	options := &clientbase.ClientOpts{
		URL:       serverURL,
		AccessKey: config.AccessKey,
		SecretKey: config.SecretKey,
		CACerts:   config.CACerts,
		Timeout:   timeout,
	}
	return options
}
