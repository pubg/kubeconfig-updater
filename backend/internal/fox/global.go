package fox

import (
	"github.krafton.com/xtrm/fox/client"
	"os"
)

var _client *client.FoxClient

func GetFoxClient() (*client.FoxClient, error) {
	if _client == nil {
		addr, exists := os.LookupEnv("FOX_ADDR")
		if !exists {
			addr = "https://fox.xtrm-dev.io"
		}

		foxClient, err := client.NewClient(&client.FoxClientConfig{
			APIUrl: addr,
		})

		if err != nil {
			return nil, err
		}

		_client = foxClient
	}

	return _client, nil
}
