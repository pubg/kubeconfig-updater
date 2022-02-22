package application_controller

import (
	"context"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/raw_config_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type applicationService struct {
	RawConfigService *raw_config_service.Service
	protos.UnimplementedApplicationServer
}

func NewController(service *raw_config_service.Service) protos.ApplicationServer {
	return &applicationService{
		RawConfigService: service,
	}
}

func (s *applicationService) Ping(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	return &protos.CommonRes{
		Message: "pong",
	}, nil
}

func (s *applicationService) Version(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	return &protos.CommonRes{
		Message: types.VERSION,
	}, nil
}

func (s *applicationService) GetConfig(_ context.Context, req *protos.GetConfigReq) (*protos.GetConfigRes, error) {
	cfg, err := s.RawConfigService.GetConfig(req.Name)
	if err != nil {
		return &protos.GetConfigRes{
			CommonRes: &protos.CommonRes{
				Status:  protos.ResultCode_SERVER_INTERNAL,
				Message: err.Error(),
			},
			Data: "",
		}, nil
	}

	return &protos.GetConfigRes{
		CommonRes: &protos.CommonRes{
			Status:  protos.ResultCode_SUCCESS,
			Message: "Success",
		},
		Data: *cfg,
	}, nil
}

func (s *applicationService) SetConfig(_ context.Context, req *protos.SetConfigReq) (*protos.SetConfigRes, error) {
	err := s.RawConfigService.SetConfig(req.Name, req.Data)

	if err != nil {
		return &protos.SetConfigRes{
			CommonRes: &protos.CommonRes{
				Status:  protos.ResultCode_SERVER_INVALID_ARGUMENT,
				Message: err.Error(),
			},
		}, nil
	}

	return &protos.SetConfigRes{
		CommonRes: &protos.CommonRes{
			Status:  protos.ResultCode_SUCCESS,
			Message: "Success",
		},
	}, nil
}
