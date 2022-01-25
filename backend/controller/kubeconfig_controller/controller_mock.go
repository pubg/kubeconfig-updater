package kubeconfig_controller

import (
	"context"
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type kubeconfigServiceMock struct {
	protos.UnimplementedKubeconfigServer

	credResolvers []*protos.CredResolverConfig
	clusters      []*protos.ClusterMetadata
	clusterInfors []*protos.AggregatedClusterMetadata
}

func (s *kubeconfigServiceMock) GetAvailableCredResolvers(context.Context, *protos.CommonReq) (*protos.GetCredResolversRes, error) {
	res := &protos.GetCredResolversRes{
		CommonRes: &protos.CommonRes{
			Status:  protos.ResultCode_SUCCESS,
			Message: "success",
		},
		Configs: s.credResolvers,
	}
	return res, nil
}

func (s *kubeconfigServiceMock) SetCredResolver(ctx context.Context, req *protos.CredResolverConfig) (*protos.CommonRes, error) {
	for index, resolver := range s.credResolvers {
		if resolver.AccountId == req.AccountId {
			s.credResolvers[index] = req
			return &protos.CommonRes{
				Message: "override already exists resolver",
			}, nil
		}
	}

	s.credResolvers = append(s.credResolvers, req)
	return &protos.CommonRes{
		Message: "append new resolver",
	}, nil
}

func (s *kubeconfigServiceMock) SetCredResolvers(ctx context.Context, req *protos.CredResolversReq) (*protos.CommonRes, error) {
	s.credResolvers = req.GetConfigs()
	return &protos.CommonRes{
		Message: "override all resolvers",
	}, nil
}

func (s *kubeconfigServiceMock) DeleteCredResolver(context.Context, *protos.DeleteCredResolverReq) (*protos.CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteCredResolver not implemented")
}

func (s *kubeconfigServiceMock) GetAvailableClusters(context.Context, *protos.CommonReq) (*protos.GetAvailableClustersRes, error) {
	return &protos.GetAvailableClustersRes{
		CommonRes: &protos.CommonRes{
			Message: "discover success",
		},
		Clusters: s.clusterInfors,
	}, nil
}

func (s *kubeconfigServiceMock) RegisterCluster(ctx context.Context, req *protos.RegisterClusterReq) (*protos.CommonRes, error) {
	for _, resolver := range s.credResolvers {
		if resolver.GetAccountId() == req.AccountId {

			for _, cluster := range s.clusterInfors {
				if cluster.GetMetadata().GetClusterName() == req.ClusterName {
					cluster.Status = protos.ClusterInformationStatus_REGISTERED_OK
					return &protos.CommonRes{
						Message: fmt.Sprintf("register success %s", req.ClusterName),
					}, nil
				}
			}

			return &protos.CommonRes{
				Status:  protos.ResultCode_INVALID_ARGUMENT,
				Message: "cannot find matched cluster name",
			}, nil
		}
	}
	return &protos.CommonRes{
		Status:  protos.ResultCode_INVALID_ACCOUNT,
		Message: "cannot find matched credential resolver",
	}, nil
}

func NewMockController() protos.KubeconfigServer {
	controller := &kubeconfigServiceMock{}
	controller.credResolvers = []*protos.CredResolverConfig{
		{AccountId: "418047124903", InfraVendor: "AWS", AccountAlias: "myaccount1", Kind: protos.CredentialResolverKind_DEFAULT, Status: protos.CredentialResolverStatus_CRED_RESOLVER_UNKNOWN},
		{AccountId: "200019689895", InfraVendor: "Tencent", AccountAlias: "myaccount2", Kind: protos.CredentialResolverKind_PROFILE, Status: protos.CredentialResolverStatus_CRED_REGISTERED_OK},
		{AccountId: "350993443303", InfraVendor: "AWS", AccountAlias: "myaccount3", Kind: protos.CredentialResolverKind_IMDS, Status: protos.CredentialResolverStatus_CRED_SUGGESTION_OK},
		{AccountId: "f073f292-7255-416f-adaf-34b476e050be", InfraVendor: "Azure", AccountAlias: "myaccount4", Kind: protos.CredentialResolverKind_PROFILE, ResolverAttributes: map[string]string{"profile": "mfa"}, Status: protos.CredentialResolverStatus_CRED_REGISTERED_OK},
	}
	controller.clusterInfors = []*protos.AggregatedClusterMetadata{
		{
			Metadata: &protos.ClusterMetadata{
				ClusterName:    "dev-asia-web-cluster1",
				CredResolverId: "418047124903",
				ClusterTags: map[string]string{
					"ServiceTag":    "main",
					"InfraVendor":   "AWS",
					"ClusterRegion": "ap-northeast-2",
					"ClusterEngine": "EKS",
				},
			},
			DataResolvers: []string{"KubeConfig/22", "AWS/33"},
			Status:        protos.ClusterInformationStatus_REGISTERED_NOTOK_CRED_RES_NOTOK,
		},
		{
			Metadata: &protos.ClusterMetadata{
				ClusterName:    "dev-asia-web-cluster2",
				CredResolverId: "548322143865",
				ClusterTags: map[string]string{
					"ServiceTag":    "main",
					"InfraVendor":   "AWS",
					"ClusterRegion": "us-east-1",
					"ClusterEngine": "EKS",
				},
			},
			DataResolvers: []string{"AWS/33"},
			Status:        protos.ClusterInformationStatus_SUGGESTION_OK,
		},
		{
			Metadata: &protos.ClusterMetadata{
				ClusterName:    "dev-eu-db-cluster1",
				CredResolverId: "418047124903",
				ClusterTags: map[string]string{
					"ServiceTag":    "main",
					"InfraVendor":   "AWS",
					"ClusterRegion": "us-east-1",
					"ClusterEngine": "AKS",
				},
			},
			DataResolvers: []string{"Azure/33"},
			Status:        protos.ClusterInformationStatus_REGISTERED_NOTOK_CRED_RES_NOTOK,
		},
		{
			Metadata: &protos.ClusterMetadata{
				ClusterName:    "prod-na-web-cluster1",
				CredResolverId: "418047124903",
				ClusterTags: map[string]string{
					"ServiceTag":    "main",
					"ClusterEngine": "AKS",
				},
			},
			DataResolvers: []string{"Azure/33"},
			Status:        protos.ClusterInformationStatus_SUGGESTION_OK,
		},
		{
			Metadata: &protos.ClusterMetadata{
				ClusterName:    "prod-eu-db-cluster1",
				CredResolverId: "418047124903",
				ClusterTags: map[string]string{
					"ClusterEngine": "TKE",
				},
			},
			DataResolvers: []string{"Tencent/33"},
			Status:        protos.ClusterInformationStatus_REGISTERED_OK,
		},
		{
			Metadata: &protos.ClusterMetadata{
				ClusterName:    "prod-na-db-cluster1",
				CredResolverId: "418047124903",
				ClusterTags: map[string]string{
					"ClusterEngine": "GKE",
				},
			},
			DataResolvers: []string{"Google/33"},
			Status:        protos.ClusterInformationStatus_REGISTERED_NOTOK_CRED_RES_NOTOK,
		},
	}
	return controller
}
