package configs

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/ghodss/yaml"
)

func LoadConfig(absPath string) (*ApplicationConfig, error) {
	fmt.Printf("Load ApplicationConfig From %s\n", absPath)
	buf, err := ioutil.ReadFile(absPath)
	if err != nil {
		return nil, err
	}
	cfg := &ApplicationConfig{}
	err = yaml.Unmarshal(buf, &cfg)
	if err != nil {
		return nil, err
	}
	return cfg, nil
}

func CheckExistsOrCreateDefault(absPath string) error {
	if _, err := os.Stat(absPath); errors.Is(err, os.ErrNotExist) {
		fmt.Printf("Initialize New Config From Memory in %s\n", absPath)
		cfg := &ApplicationConfig{
			DataStores: &DataStores{
				AggregatedClusterMetadata: &DataStoreConfig{Path: "~/.kubeconfig-updater-gui/aggregated-cluster-metadata-cache.json"},
				CredResolverConfig:        &DataStoreConfig{Path: "~/.kubeconfig-updater-gui/cred-resolver-config.json"},
			},
			AutoUpdate: false,
			Extensions: &Extension{
				Fox: &FoxExtension{
					Enable: true,
					Address:  "https://fox.xtrm-central.io",
					UseCache: true,
				},
				Eks: &EksExtension{
					UseEksRoleLogin:    false,
					EksRoleNamePattern: "",
				},
				Aks: &AksExtension{UseKubelogin: true},
			},
		}
		buf, err := yaml.Marshal(cfg)
		if err != nil {
			return err
		}
		err = ioutil.WriteFile(absPath, buf, 0644)
		if err != nil {
			return err
		}
	}
	return nil
}

const (
	RESOLVE_METHOD_LOCALFILE = iota
	RESOLVE_METHOD_URL
)
