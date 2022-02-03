package pkg

import (
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/aws"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/azure"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/gcp"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/rancher"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/tencent"

	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service/aws"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service/azure"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service/fox"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service/gcp"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service/kubeconfig"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service/rancher"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service/tencent"

	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service/aks"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service/eks"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service/gke"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service/rancher"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service/tke"
)
