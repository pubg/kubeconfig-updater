package kubeconfig_service

import (
	"context"
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

type kubeconfigService struct {
	protos.UnimplementedKubeconfigServer
}

func NewController() protos.KubeconfigServer {
	return &kubeconfigService{}
}

func (s *kubeconfigService) GetAvailableCredResolvers(context.Context, *protos.CommonReq) (*protos.GetCredResolversRes, error) {
	cfgs := cred_resolver_service.ListCredResolvers()

	res := &protos.GetCredResolversRes{
		CommonRes: &protos.CommonRes{
			Status:  protos.ResultCode_SUCCESS,
			Message: "list resolvers success",
		},
		Configs: cfgs,
	}
	return res, nil
}

func (s *kubeconfigService) SetCredResolver(ctx context.Context, req *protos.CredResolverConfig) (*protos.CommonRes, error) {
	err := cred_resolver_service.SetCredResolver(req)
	if err != nil {
		return nil, err
	}
	return &protos.CommonRes{
		Message: "set resolver success",
	}, nil
}

func (s *kubeconfigService) SetCredResolvers(ctx context.Context, req *protos.CredResolversReq) (*protos.CommonRes, error) {
	cfgs := req.GetConfigs()
	for _, cfg := range cfgs {
		err := cred_resolver_service.SetCredResolver(cfg)
		if err != nil {
			return nil, err
		}
	}
	return &protos.CommonRes{
		Message: "set resolvers success",
	}, nil
}

func (s *kubeconfigService) DeleteCredResolver(ctx context.Context, cfg *protos.DeleteCredResolverReq) (*protos.CommonRes, error) {
	err := cred_resolver_service.DeleteCredResolver(cfg.AccountId)
	if err != nil {
		return nil, err
	}
	return &protos.CommonRes{
		Message: "delete resolver success",
	}, nil
}

func (s *kubeconfigService) GetAvailableClusters(context.Context, *protos.CommonReq) (*protos.GetAvailableClustersRes, error) {
	clusters := cluster_metadata_service.ListClusterMetadatas()

	return &protos.GetAvailableClustersRes{
		CommonRes: &protos.CommonRes{
			Message: "discover success",
		},
		Clusters: clusters,
	}, nil
}

func (s *kubeconfigService) RegisterCluster(ctx context.Context, req *protos.RegisterClusterReq) (*protos.CommonRes, error) {
	if req.AccountId == "" {
		return &protos.CommonRes{
			Status:  protos.ResultCode_INVALID_ARGUMENT,
			Message: "accountId should not be empty",
		}, nil
	}

	cfg, exists, err := cred_resolver_service.GetCredResolver(req.AccountId)
	if err != nil {
		return &protos.CommonRes{
			Status:  protos.ResultCode_SERVER_INTERNAL,
			Message: err.Error(),
		}, nil
	}

	if !exists {
		return &protos.CommonRes{
			Status:  protos.ResultCode_INVALID_ARGUMENT,
			Message: "credResolver not registered",
		}, nil
	}

	err = cluster_register_service.RegisterCluster(ctx, req.ClusterName, cfg)
	if err != nil {
		return &protos.CommonRes{
			Status:  protos.ResultCode_SERVER_INTERNAL,
			Message: err.Error(),
		}, nil
	}

	return &protos.CommonRes{
		Message: fmt.Sprintf("%s cluster register success", req.ClusterName),
	}, nil
}

func (s *kubeconfigService) SyncAvailableClusters(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	fmt.Printf("Start SyncAvailableClusters\n")
	err := cluster_metadata_service.SyncAvailableClusters()
	fmt.Printf("Success SyncAvailableClusters\n")
	if err != nil {
		return nil, err
	}
	return &protos.CommonRes{
		Message: fmt.Sprintf("sync success"),
	}, nil
}

func (s *kubeconfigService) Ping(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	return &protos.CommonRes{
		Message: fmt.Sprintf("pong"),
	}, nil
}
