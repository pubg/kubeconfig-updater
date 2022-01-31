package tencent

import (
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/concurrency"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"log"
)

func init()  {
	if err := credentials.RegisterLocalCred(types.InfraVendor_Tencent, &LocalCred{}); err != nil {
		log.Fatalln(err)
	}
}

type LocalCred struct {
}

func (a *LocalCred) GetLocalProfiles() ([]*protos.Profile, error) {
	profileNames, err := tencent_service.GetProfiles()
	if err != nil {
		return nil, err
	}

	parallelOuts := concurrency.Parallel(common.ToInterfaceSlice(profileNames), func(in interface{}) (output interface{}, err error) {
		profileName, ok := in.(string)
		if !ok {
			return nil, fmt.Errorf("cannot cast input to string")
		}

		provider := tencent_service.NewTencentIntlProfileProvider(profileName)
		accountIdOrEmpty, _ := tencent_service.GetConfigInfo(provider)
		return &protos.Profile{
			ProfileName: profileName,
			AccountId:   accountIdOrEmpty,
			InfraVendor: types.InfraVendor_Tencent.String(),
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
