package cred_resolver_config_persist

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/schollz/jsonstore"
)

type CredResolverConfigStorage struct {
	keyStore    *jsonstore.JSONStore
	StoragePath string
}

// FirstLoad, Error
func (c *CredResolverConfigStorage) LoadStorage() (bool, error) {
	err := os.MkdirAll(filepath.Dir(c.StoragePath), os.ModePerm)
	if err != nil {
		return false, err
	}
	if _, err = os.Stat(c.StoragePath); errors.Is(err, os.ErrNotExist) {
		fmt.Printf("Initialize New CredResolverConfig in %s\n", c.StoragePath)
		c.keyStore = new(jsonstore.JSONStore)
		return true, nil
	}
	fmt.Printf("Load CredResolverConfig From %s\n", c.StoragePath)
	ks, err := jsonstore.Open(c.StoragePath)
	if err != nil {
		return false, err
	}
	c.keyStore = ks
	return false, nil
}

func (c *CredResolverConfigStorage) SaveStorage() error {
	return jsonstore.Save(c.keyStore, c.StoragePath)
}

func (c *CredResolverConfigStorage) ListConfigs() []*protos.CredResolverConfig {
	var configs []*protos.CredResolverConfig
	for _, key := range c.keyStore.Keys() {
		var cfg protos.CredResolverConfig
		c.keyStore.Get(key, &cfg)
		configs = append(configs, &cfg)
	}
	return configs
}

func (c *CredResolverConfigStorage) GetConfig(credResolverId string) (*protos.CredResolverConfig, bool) {
	var cfg protos.CredResolverConfig
	err := c.keyStore.Get(credResolverId, &cfg)
	if _, ok := err.(jsonstore.NoSuchKeyError); ok {
		return nil, false
	}
	return &cfg, true
}

func (c *CredResolverConfigStorage) SetConfig(cfg *protos.CredResolverConfig) error {
	return c.keyStore.Set(cfg.AccountId, cfg)
}

func (c *CredResolverConfigStorage) SetAndSaveConfig(cfg *protos.CredResolverConfig) error {
	err := c.SetConfig(cfg)
	if err != nil {
		return err
	}
	return c.SaveStorage()
}

func (c *CredResolverConfigStorage) DeleteConfig(credResolverId string) error {
	if _, exists := c.GetConfig(credResolverId); !exists {
		return fmt.Errorf("credResolverConfig not eixsts id: %s", credResolverId)
	}
	c.keyStore.Delete(credResolverId)
	return nil
}
