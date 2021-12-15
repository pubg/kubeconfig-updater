package cluster_metadata_persist

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/schollz/jsonstore"
	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"
)

type AggregatedClusterMetadataStorage struct {
	keyStore    *jsonstore.JSONStore
	StoragePath string
}

//FirstLoad, Error
func (c *AggregatedClusterMetadataStorage) LoadStorage() (bool, error) {
	err := os.MkdirAll(filepath.Dir(c.StoragePath), os.ModePerm)
	if err != nil {
		return false, err
	}
	if _, err = os.Stat(c.StoragePath); errors.Is(err, os.ErrNotExist) {
		fmt.Printf("Initialize New AggregatedClusterMetadata Cache in %s\n", c.StoragePath)
		c.keyStore = new(jsonstore.JSONStore)
		return true, nil
	}
	fmt.Printf("Load AggregatedClusterMetadata Cache From %s\n", c.StoragePath)
	ks, err := jsonstore.Open(c.StoragePath)
	if err != nil {
		return false, err
	}
	c.keyStore = ks
	return false, nil
}

func (c *AggregatedClusterMetadataStorage) SaveStorage() error {
	return jsonstore.Save(c.keyStore, c.StoragePath)
}

func (c *AggregatedClusterMetadataStorage) ClearStorage() {
	c.keyStore = new(jsonstore.JSONStore)
}

func (c *AggregatedClusterMetadataStorage) ListAggrMetadata() []*protos.AggregatedClusterMetadata {
	var metas []*protos.AggregatedClusterMetadata
	for _, key := range c.keyStore.Keys() {
		var meta protos.AggregatedClusterMetadata
		c.keyStore.Get(key, &meta)
		metas = append(metas, &meta)
	}
	return metas
}

func (c *AggregatedClusterMetadataStorage) GetAggrMetadata(clusterName string) (*protos.AggregatedClusterMetadata, bool) {
	var meta protos.AggregatedClusterMetadata
	err := c.keyStore.Get(clusterName, &meta)
	if _, ok := err.(jsonstore.NoSuchKeyError); ok {
		return nil, false
	}
	return &meta, true
}

func (c *AggregatedClusterMetadataStorage) SetAggrMetadata(meta *protos.AggregatedClusterMetadata) error {
	return c.keyStore.Set(meta.Metadata.ClusterName, meta)
}

func (c *AggregatedClusterMetadataStorage) DeleteAggrMetadata(clusterName string) error {
	if _, exists := c.GetAggrMetadata(clusterName); !exists {
		return fmt.Errorf("AggregatedClusterMetadata not eixsts, id: %s", clusterName)
	}
	c.keyStore.Delete(clusterName)
	return nil
}
