package cluster_metadata_persist

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/schollz/jsonstore"
)

type ClusterMetadataStorage struct {
	keyStore    *jsonstore.JSONStore
	StoragePath string
}

//FirstLoad, Error
func (c *ClusterMetadataStorage) LoadStorage() (bool, error) {
	err := os.MkdirAll(filepath.Dir(c.StoragePath), os.ModePerm)
	if err != nil {
		return false, err
	}
	if _, err = os.Stat(c.StoragePath); errors.Is(err, os.ErrNotExist) {
		fmt.Printf("Initialize New ClusterMetadata Cache in %s\n", c.StoragePath)
		c.keyStore = new(jsonstore.JSONStore)
		return true, nil
	}
	fmt.Printf("Load ClusterMetadata Cache From %s\n", c.StoragePath)
	ks, err := jsonstore.Open(c.StoragePath)
	if err != nil {
		return false, err
	}
	c.keyStore = ks
	return false, nil
}

func (c *ClusterMetadataStorage) SaveStorage() error {
	return jsonstore.Save(c.keyStore, c.StoragePath)
}

func (c *ClusterMetadataStorage) ClearStorage() {
	c.keyStore = new(jsonstore.JSONStore)
}

func (c *ClusterMetadataStorage) ListMetadata() []*protos.ClusterMetadata {
	var metas []*protos.ClusterMetadata
	for _, key := range c.keyStore.Keys() {
		var meta protos.ClusterMetadata
		c.keyStore.Get(key, &meta)
		metas = append(metas, &meta)
	}
	return metas
}

func (c *ClusterMetadataStorage) GetMetadata(clusterName string) (*protos.ClusterMetadata, bool) {
	var meta protos.ClusterMetadata
	err := c.keyStore.Get(clusterName, &meta)
	if _, ok := err.(jsonstore.NoSuchKeyError); ok {
		return nil, false
	}
	return &meta, true
}

func (c *ClusterMetadataStorage) SetMetadata(meta *protos.ClusterMetadata) error {
	return c.keyStore.Set(meta.ClusterName, meta)
}

func (c *ClusterMetadataStorage) DeleteMetadata(clusterName string) error {
	if _, exists := c.GetMetadata(clusterName); !exists {
		return fmt.Errorf("ClusterMetadata not eixsts, id: %s", clusterName)
	}
	c.keyStore.Delete(clusterName)
	return nil
}
