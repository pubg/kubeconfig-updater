package rancher_service

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/rancher/cli/config"
)

const configFile = "cli2.json"

func LoadConfig() (*config.Config, error) {
	dir, err := getRancherConfigDirectory()
	if err != nil {
		return nil, err
	}
	path := filepath.Join(dir, configFile)

	cf := &config.Config{
		Path:    path,
		Servers: make(map[string]*config.ServerConfig),
	}

	content, err := ioutil.ReadFile(path)
	if os.IsNotExist(err) {
		return cf, nil
	} else if err != nil {
		return nil, err
	}

	err = json.Unmarshal(content, cf)
	if err != nil {
		return nil, err
	}

	return cf, nil
}

func getRancherConfigDirectory() (string, error) {
	return common.ResolvePathToAbs(filepath.Join("~", ".rancher"))
}

func GetServers() ([]string, error) {
	cfg, err := LoadConfig()
	if err != nil {
		return nil, err
	}

	var servers []string
	for name := range cfg.Servers {
		servers = append(servers, name)
	}
	return servers, nil
}
