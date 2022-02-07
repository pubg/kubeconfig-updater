package eks

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"log"

	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/expressions"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

func init() {
	factory := &cluster_register_service.RegisterFactory{FactoryFunc: NewEksRegister}
	if err := cluster_register_service.RegisterRegisterFactory(types.InfraVendor_AWS, factory); err != nil {
		log.Fatalln(err)
	}
}

type Register struct {
	profileOrEmpty string
	extension      []*configs.EksAssumeRoleExt
}

func NewEksRegister(credResolver credentials.CredResolver, extension *configs.Extension) (cluster_register_service.ClusterRegister, error) {
	_, profileOrEmpty, err := credResolver.GetSdkConfig(context.TODO())
	if err != nil {
		return nil, err
	}
	return &Register{profileOrEmpty: profileOrEmpty, extension: extension.EksAssumeRoles}, nil
}

func (r *Register) RegisterCluster(ctx context.Context, meta *protos.AggregatedClusterMetadata) error {
	clusterName := meta.Metadata.ClusterName

	clusterRegion, err := common.GetItemOrError(meta.Metadata.ClusterTags, types.KnownClusterTag_ClusterRegion.String())
	if err != nil {
		return fmt.Errorf("clusterMetadata should have %s tag, but not exists", types.KnownClusterTag_ClusterRegion.String())
	}

	for _, roleExt := range r.extension {
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
			return aws_service.RegisterEks(clusterName, clusterRegion, roleArn, r.profileOrEmpty)
		}
	}

	return aws_service.RegisterEks(clusterName, clusterRegion, "", r.profileOrEmpty)
}
