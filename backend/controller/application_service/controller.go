package application_service

import (
	"context"
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/versions"
)

type applicationService struct {
	protos.UnimplementedApplicationServer
}

func NewController() protos.ApplicationServer {
	return &applicationService{}
}

func (s *applicationService) Ping(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	return &protos.CommonRes{
		Message: fmt.Sprintf("pong"),
	}, nil
}

func (s *applicationService) Version(context.Context, *protos.CommonReq) (*protos.CommonRes, error) {
	return &protos.CommonRes{
		Message: versions.GetVersion(),
	}, nil
}
