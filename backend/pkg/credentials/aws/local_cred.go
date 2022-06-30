package aws

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/concurrency"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

func init() {
	if err := credentials.RegisterLocalCred(types.InfraVendor_AWS, &LocalCred{}); err != nil {
		log.Fatalln(err)
	}
}

type LocalCred struct {
}

func (a *LocalCred) GetLocalProfiles() ([]*protos.Profile, error) {
	profileNames, err := aws_service.GetProfiles()
	if err != nil {
		return nil, err
	}

	parallelOuts := concurrency.Parallel(common.ToInterfaceSlice(profileNames), func(in interface{}) (output interface{}, err error) {
		profileName, ok := in.(string)
		if !ok {
			return nil, fmt.Errorf("cannot cast input to string")
		}

		cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithSharedConfigProfile(profileName))
		if err != nil {
			return nil, err
		}
		accountIdOrEmpty, tolerableErr := aws_service.GetConfigInfo(&cfg)
		if tolerableErr != nil {
			fmt.Printf("aws.LocalCred.GetLocalProfiles TolerableErr %s", tolerableErr.Error())
		}
		return &protos.Profile{
			ProfileName: profileName,
			AccountId:   accountIdOrEmpty,
			InfraVendor: types.InfraVendor_AWS.String(),
		}, nil
	})

	var profiles []*protos.Profile
	for _, out := range parallelOuts {
		if out.Err != nil {
			return nil, out.Err
		}
		profiles = append(profiles, out.Output.(*protos.Profile))
	}
	return profiles, nil
}
