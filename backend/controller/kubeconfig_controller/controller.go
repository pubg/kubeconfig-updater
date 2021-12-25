package kubeconfig_controller

import (
	"context"
	"fmt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/kubeconfig_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
)

type kubeconfigService struct {
	protos.UnimplementedKubeconfigServer

	credStoreService    *cred_resolver_service.CredResolverStoreService
	credResolverService *cred_resolver_service.CredResolveService
	registerService     *cluster_register_service.ClusterRegisterService
	metadataService     *cluster_metadata_service.ClusterMetadataService
}

func NewKubeconfigService(credStoreService *cred_resolver_service.CredResolverStoreService, credResolverService *cred_resolver_service.CredResolveService, registerService *cluster_register_service.ClusterRegisterService, metadataService *cluster_metadata_service.ClusterMetadataService) *kubeconfigService {
	return &kubeconfigService{credStoreService: credStoreService, credResolverService: credResolverService, registerService: registerService, metadataService: metadataService}
}

func (s *kubeconfigService) GetAvailableCredResolvers(context.Context, *protos.CommonReq) (*protos.GetCredResolversRes, error) {
	cfgs := s.credStoreService.ListCredResolvers()

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
	err := s.credStoreService.SetCredResolver(req)
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
		err := s.credStoreService.SetCredResolver(cfg)
		if err != nil {
			return nil, err
		}
	}
	return &protos.CommonRes{
		Message: "set resolvers success",
	}, nil
}

func (s *kubeconfigService) DeleteCredResolver(ctx context.Context, cfg *protos.DeleteCredResolverReq) (*protos.CommonRes, error) {
	err := s.credStoreService.DeleteCredResolver(cfg.AccountId)
	if err != nil {
		return nil, err
	}
	return &protos.CommonRes{
		Message: "delete resolver success",
	}, nil
}

func (s *kubeconfigService) SyncAvailableCredResolver(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	fmt.Printf("Start SyncAvailableCredResolver\n")
	err := s.credResolverService.SyncCredResolversStatus()
	fmt.Printf("Success SyncAvailableCredResolver\n")
	if err != nil {
		return nil, err
	}
	return &protos.CommonRes{
		Message: fmt.Sprintf("sync success"),
	}, nil
}

func (s *kubeconfigService) GetProfiles(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetProfiles not implemented")
}

func (s *kubeconfigService) GetAvailableClusters(context.Context, *protos.CommonReq) (*protos.GetAvailableClustersRes, error) {
	clusters := s.metadataService.ListClusterMetadatas()

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

	cfg, exists, err := s.credStoreService.GetCredResolver(req.AccountId)
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

	err = s.registerService.RegisterCluster(ctx, req.ClusterName, cfg)
	if err != nil {
		return &protos.CommonRes{
			Status:  protos.ResultCode_SERVER_INTERNAL,
			Message: err.Error(),
		}, nil
	}

	err = s.metadataService.SetClusterRegisteredStatus(req.ClusterName)
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

func (s *kubeconfigService) DeleteCluster(ctx context.Context, req *protos.DeleteClusterReq) (*protos.CommonRes, error) {
	if req.ClusterName == "" {
		return &protos.CommonRes{
			Status:  protos.ResultCode_INVALID_ARGUMENT,
			Message: "ClusterName should not be empty",
		}, nil
	}

	success, err := kubeconfig_service.DeleteContext(req.ClusterName, req.Cascade)
	if err != nil {
		return nil, err
	}

	if success {
		return &protos.CommonRes{
			Status:  protos.ResultCode_SUCCESS,
			Message: fmt.Sprintf("Delete Context Success Name:%s", req.ClusterName),
		}, nil
	} else {
		return &protos.CommonRes{
			Status:  protos.ResultCode_NOT_FOUND,
			Message: fmt.Sprintf("Cannot Find Target Context Name:%s", req.ClusterName),
		}, nil
	}
}

func (s *kubeconfigService) SyncAvailableClusters(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	fmt.Printf("Start SyncAvailableClusters\n")
	err := s.metadataService.SyncAvailableClusters()
	fmt.Printf("Success SyncAvailableClusters\n")
	if err != nil {
		return nil, err
	}
	return &protos.CommonRes{
		Message: fmt.Sprintf("sync success"),
	}, nil
}
