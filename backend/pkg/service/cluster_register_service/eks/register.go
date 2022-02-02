package eks

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/expressions"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type Register struct {
	profile string
	exts []*configs.EksAssumeRoleExt
}

func NewEksRegister(credResolver credentials.CredResolver,extension *configs.Extension) cluster_register_service.ClusterRegister {
	credResolver.GetSdkConfig(context.TODO())
	return &Register{credResolver: credResolver, extension: extension}
}

func (r *Register) RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error {
	clusterName := meta.Metadata.ClusterName

	_, profileOrEmpty, err := cred.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, err
	}

	_, profileOrEmpty, err := r.credService.GetAwsSdkConfig(ctx, credConf)
	if err != nil {
		return err
	}
	clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterRegion.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterRegion.String())
	}

	for _, roleExt := range r.extension.EksAssumeRoles {
		clusterExpr, err := expressions.NewFromConfig(roleExt.ClusterFilterExpression)
		if err != nil {
			return err
		}

		//모든 태그 넣어야 할듯
		inputMap := map[string]string{
			"ClusterName":   clusterName,
			"ClusterRegion": clusterRegion,
		}
		matched, err := clusterExpr.MatchEvaluate(inputMap, clusterName)
		if err != nil {
			return err
		}

		if matched {
			roleExpr, err := expressions.NewFromConfig(roleExt.RoleNameExpression)
			if err != nil {
				return err
			}

			roleArn, err := roleExpr.StringEvaluate(inputMap, []interface{}{clusterName, clusterRegion})
			if err != nil {
				return err
			}
			return aws_service.RegisterEks(clusterName, clusterRegion, roleArn, profileOrEmpty)
		}
	}

	return aws_service.RegisterEks(clusterName, clusterRegion, "", profileOrEmpty)
}
