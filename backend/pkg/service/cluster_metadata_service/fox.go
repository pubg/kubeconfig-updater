package cluster_metadata_service

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/mitchellh/mapstructure"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"github.krafton.com/xtrm/fox/client"
	"github.krafton.com/xtrm/fox/source/pkg/document"
)

func NewFoxResolver(addr string) (*FoxResolver, error) {
	foxClient, err := client.NewClient(&client.FoxClientConfig{
		APIUrl: addr,
	})
	if err != nil {
		return nil, err
	}

	return &FoxResolver{
		foxClient: foxClient,
	}, nil
}

type FoxResolver struct {
	foxClient *client.FoxClient
}

func (f *FoxResolver) GetResolverDescription() string {
	return "PUBG-Fox"
}

func (f *FoxResolver) GetCluster(clusterName string) (*protos.ClusterMetadata, bool, error) {
	docId := fmt.Sprintf("%[1]s-common", clusterName)
	exists, err := f.foxClient.ExistDocument(docId)
	if err != nil {
		return nil, false, err
	}
	if !exists {
		return nil, false, nil
	}

	doc, err := f.foxClient.GetDocument(docId)
	if err != nil {
		return nil, false, err
	}

	metadata, err := parseDoc(doc)
	if err != nil {
		return nil, false, err
	}
	return metadata, true, nil
}

func (f *FoxResolver) ListClusters() ([]*protos.ClusterMetadata, error) {
	perPageSize := 100
	pageIndex := 1

	var allDocs []document.Document
	for {
		docs, err := f.foxClient.GetDocumentAll(perPageSize, pageIndex)
		if err != nil {
			return nil, err
		}
		if len(*docs) == 0 {
			break
		}
		pageIndex++
		allDocs = append(allDocs, *docs...)
	}

	var clusterMetas []*protos.ClusterMetadata
	for _, doc := range allDocs {
		if strings.HasSuffix(doc.Id, "-common") {
			meta, err := parseDoc(&doc)
			if err != nil {
				fmt.Printf("[Error] Can't parse fox doc to cluster metadata %s (%s)\n", doc.Id, err.Error())
			}
			clusterMetas = append(clusterMetas, meta)
		}
	}
	return clusterMetas, nil
}

func parseDoc(doc *document.Document) (*protos.ClusterMetadata, error) {
	var foxMetadata FoxClusterMetadata
	err := mapstructure.Decode(doc.Data, &foxMetadata)
	if err != nil {
		return nil, err
	}

	targetMetadata := &protos.ClusterMetadata{
		ClusterTags: map[string]string{},
	}
	targetMetadata.ClusterName = foxMetadata.ClusterName
	targetMetadata.CredResolverId = foxMetadata.InfraAccountId
	targetMetadata.ClusterTags[types.KnownClusterTag_ClusterRegion.String()] = foxMetadata.ClusterRegion
	targetMetadata.ClusterTags["InfraAccountId"] = foxMetadata.InfraAccountId
	targetMetadata.ClusterTags["ClusterEngine"] = foxMetadata.ClusterEngine
	targetMetadata.ClusterTags["InfraVendor"] = foxMetadata.InfraVendor
	targetMetadata.ClusterTags["ServicePhase"] = foxMetadata.ServicePhase
	targetMetadata.ClusterTags["ServiceTag"] = foxMetadata.ServiceTag
	targetMetadata.ClusterTags["CentralRole"] = strconv.FormatBool(foxMetadata.CentralRole)
	targetMetadata.ClusterTags["OutgameRole"] = strconv.FormatBool(foxMetadata.OutgameRole)
	targetMetadata.ClusterTags["IntgameRole"] = strconv.FormatBool(foxMetadata.IntgameRole)
	return targetMetadata, nil
}

type FoxClusterMetadata struct {
	ClusterName    string `json:"clusterName"`
	ClusterRegion  string `json:"clusterRegion"`
	InfraAccountId string `json:"infraAccountId"`
	ClusterEngine  string `json:"clusterEngine"`
	InfraVendor    string `json:"infraVendor"`
	ServicePhase   string `json:"servicePhase"`
	ServiceTag     string `json:"serviceTag"`
	CentralRole    bool   `json:"centralRole"`
	OutgameRole    bool   `json:"outgameRole"`
	IntgameRole    bool   `json:"intgameRole"`
	ResourceGroup  string `json:"resourceGroup"`
	ClusterId      string `json:"clusterId"`
}
