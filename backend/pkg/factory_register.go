package pkg

import (
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/aws"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/azure"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/gcp"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/rancher"
	_ "github.com/pubg/kubeconfig-updater/backend/pkg/credentials/tencent"
)
