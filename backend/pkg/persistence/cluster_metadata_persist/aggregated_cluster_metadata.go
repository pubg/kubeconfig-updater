package cluster_metadata_persist

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/schollz/jsonstore"
)

type AggregatedClusterMetadataStorage struct {
	keyStore    *jsonstore.JSONStore
	StoragePath string

	swapLock sync.RWMutex
}

func (c *AggregatedClusterMetadataStorage) InitStorage() {
	c.keyStore = new(jsonstore.JSONStore)
}

// FirstLoad, Error
func (c *AggregatedClusterMetadataStorage) LoadStorage() (bool, error) {
	err := os.MkdirAll(filepath.Dir(c.StoragePath), os.ModePerm)
	if err != nil {
		return false, err
	}
	if _, err = os.Stat(c.StoragePath); errors.Is(err, os.ErrNotExist) {
		fmt.Printf("Initialize New AggregatedClusterMetadataCache in %s\n", c.StoragePath)
		c.keyStore = new(jsonstore.JSONStore)
		return true, nil
	}
	fmt.Printf("Load AggregatedClusterMetadataCache From %s\n", c.StoragePath)
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

func (c *AggregatedClusterMetadataStorage) ClearAndSet(metas []*protos.AggregatedClusterMetadata) {
	c.swapLock.Lock()
	defer c.swapLock.Unlock()
	newStorage := &AggregatedClusterMetadataStorage{}
	newStorage.InitStorage()
	for _, meta := range metas {
		newStorage.SetAggrMetadata(meta)
	}
	c.keyStore = newStorage.keyStore
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
