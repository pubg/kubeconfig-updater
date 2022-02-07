package aws

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"log"
)

func init() {
	factory := &credentials.CredResolverFactory{NewCredResolverFunc: NewAwsResolver}
	if err := credentials.RegisterFactory(types.InfraVendor_AWS, factory); err != nil {
		log.Fatalln(err)
	}
}

func NewAwsResolver(credConf *protos.CredResolverConfig) (credentials.CredResolver, error) {
	switch credConf.GetKind() {
	case protos.CredentialResolverKind_DEFAULT:
		return &DefaultResolver{}, nil
	case protos.CredentialResolverKind_PROFILE:
		profile, err := credentials.GetProfileFromAttribute(credConf.GetResolverAttributes())
		if err != nil {
			return nil, err
		}
		return &ProfileResolver{profile: profile}, nil
	}

	return nil, fmt.Errorf(credentials.NotSupportedCredKind, credConf.GetKind().String())
}

type DefaultResolver struct {
}

func (r *DefaultResolver) GetSdkConfig(ctx context.Context) (cred interface{}, accountId string, err error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	return &cfg, "", err
}

func (r *DefaultResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_AWS
}

func (r *DefaultResolver) Description() string {
	return "AWS-Cred/DefaultChain"
}

func (r *DefaultResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

type ProfileResolver struct {
	profile string
}

func (r *ProfileResolver) GetSdkConfig(ctx context.Context) (cred interface{}, profile string, err error) {
	cfg, err := config.LoadDefaultConfig(ctx, config.WithSharedConfigProfile(r.profile))
	return &cfg, r.profile, err
}

func (r *ProfileResolver) SupportIdentityType() types.InfraVendor {
	return types.InfraVendor_AWS
}

func (r *ProfileResolver) Description() string {
	return fmt.Sprintf("AWS-Cred/Profile:%s", r.profile)
}

func (r *ProfileResolver) GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error) {
	return getStatus(ctx, r)
}

func getStatus(ctx context.Context, resolver credentials.CredResolver) (protos.CredentialResolverStatus, error, error) {
	cfg, _, err := resolver.GetSdkConfig(ctx)
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}
	_, err = aws_service.GetConfigInfo(cfg.(*aws.Config))
	if err != nil {
		return protos.CredentialResolverStatus_CRED_REGISTERED_NOT_OK, err, nil
	}
	return protos.CredentialResolverStatus_CRED_REGISTERED_OK, nil, nil
}
