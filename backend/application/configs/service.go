package configs

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/ghodss/yaml"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
)

func ResolveConfig(absPath string) (*ApplicationConfig, error) {
	if common.ExistsFile(absPath) {
		return loadConfig(absPath)
	}

	resolveSuccess, err := resolveFromFilePath(absPath, filepath.Join("~", "Downloads", "application-config.yaml"))
	if err != nil {
		return nil, err
	}
	if resolveSuccess {
		return loadConfig(absPath)
	}

	resolveSuccess, err = resolveFromFilePath(absPath, filepath.Join("..", "application-config.yaml"))
	if err != nil {
		return nil, err
	}
	if resolveSuccess {
		return loadConfig(absPath)
	}

	err = resolveFromInMemory(absPath)
	if err != nil {
		return nil, err
	}
	return loadConfig(absPath)
}

func loadConfig(absPath string) (*ApplicationConfig, error) {
	fmt.Printf("Load ApplicationConfig from %s\n", absPath)
	buf, err := ioutil.ReadFile(absPath)
	if err != nil {
		return nil, err
	}

	cfg := &ApplicationConfig{}
	err = yaml.Unmarshal(buf, &cfg)
	if err != nil {
		return nil, err
	}

	credResolverAbsPath, err := common.ResolvePathToAbs(cfg.DataStores.CredResolverConfig.Path)
	if err != nil {
		return nil, err
	}
	if !common.ExistsFile(credResolverAbsPath) && cfg.DefaultCredResolverConfig != "" {
		err = ioutil.WriteFile(credResolverAbsPath, []byte(cfg.DefaultCredResolverConfig), 0644)
		if err != nil {
			return nil, err
		}
		fmt.Printf("Load Default CredResolverConfig from %s to %s\n", absPath, credResolverAbsPath)
	}

	return cfg, nil
}

func resolveFromFilePath(targetAbsPath string, sourcePath string) (bool, error) {
	fmt.Printf("Check ApplicationConfig exists in %s\n", sourcePath)
	sourceAbsPath, err := common.ResolvePathToAbs(sourcePath)
	if err != nil {
		return false, err
	}

	if !common.ExistsFile(sourceAbsPath) {
		return false, nil
	}

	buf, err := ioutil.ReadFile(sourceAbsPath)
	if err != nil {
		return false, err
	}

	err = ioutil.WriteFile(targetAbsPath, buf, 0644)
	if err != nil {
		return false, err
	}

	err = os.Remove(sourceAbsPath)
	if err != nil {
		fmt.Printf("Delete Source ApplicationConfig Failed, Skip error cause it might be permission or file lock problem\n")
	}

	fmt.Printf("Move ApplicationConfig from %s to %s\n", sourceAbsPath, targetAbsPath)
	return true, nil
}

func resolveFromInMemory(targetAbsPath string) error {
	fmt.Printf("Copy Default ApplicationConfig from Memory to %s\n", targetAbsPath)
	cfg := &ApplicationConfig{
		DataStores: &DataStores{
			AggregatedClusterMetadata: &DataStoreConfig{Path: filepath.Join("~", ".kubeconfig-updater-gui", "aggregated-cluster-metadata-cache.json")},
			CredResolverConfig:        &DataStoreConfig{Path: filepath.Join("~", ".kubeconfig-updater-gui", "cred-resolver-config.json")},
		},
		AutoUpdate: false,
		Extensions: &Extension{
			Fox: &FoxExtension{
				Enable:   false,
				Address:  "",
				UseCache: false,
			},
			Eks: &EksExtension{
				UseEksRoleLogin:    false,
				EksRoleNamePattern: "",
			},
			Aks: &AksExtension{UseKubelogin: true},
		},
		DefaultCredResolverConfig: "",
	}
	buf, err := yaml.Marshal(cfg)
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(targetAbsPath, buf, 0644)
	if err != nil {
		return err
	}

	return nil
}
