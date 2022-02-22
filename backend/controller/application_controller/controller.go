package application_controller

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/raw_config_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type applicationService struct {
	protos.UnimplementedApplicationServer

	RawConfigService *raw_config_service.Service
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
	if req.Name == "" {
		return &protos.GetConfigRes{
			CommonRes: &protos.CommonRes{
				Status:  protos.ResultCode_INVALID_ARGUMENT,
				Message: "empty string is not a valid name",
			},
		}, nil
	}

	cfg, err := s.RawConfigService.GetConfig(req.Name)
	if err != nil {
		return &protos.GetConfigRes{
			CommonRes: &protos.CommonRes{
				Status:  protos.ResultCode_SERVER_INTERNAL,
				Message: err.Error(),
			},
		}, nil
	}

	return &protos.GetConfigRes{
		CommonRes: &protos.CommonRes{
			Message: fmt.Sprintf("Successfully get raw config. name: %s", req.Name),
		},
		Data: *cfg,
	}, nil
}

func (s *applicationService) SetConfig(_ context.Context, req *protos.SetConfigReq) (*protos.CommonRes, error) {
	if req.Name == "" {
		return &protos.CommonRes{
			Status:  protos.ResultCode_INVALID_ARGUMENT,
			Message: "empty string is not a valid name",
		}, nil
	}

	err := s.RawConfigService.SetConfig(req.Name, req.Data)

	if err != nil {
		return &protos.CommonRes{
			Status:  protos.ResultCode_SERVER_INVALID_ARGUMENT,
			Message: err.Error(),
		}, nil
	}

	return &protos.CommonRes{
		Message: fmt.Sprintf("Successfully save raw config. name: %s", req.Name),
	}, nil
}
