package azure

import (
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"log"
)

func init()  {
	if err := credentials.RegisterLocalCred(types.InfraVendor_Azure, &LocalCred{}); err != nil {
		log.Fatalln(err)
	}
}

type LocalCred struct {
}

func (a *LocalCred) GetLocalProfiles() ([]*protos.Profile, error) {
	subscriptions, err := azure_service.GetSubscriptions()
	if err != nil {
		return nil, err
	}
	var profiles []*protos.Profile
	for _, subscription := range subscriptions {
		profiles = append(profiles, &protos.Profile{
			ProfileName: subscription,
			AccountId:   subscription,
			InfraVendor: types.InfraVendor_Azure.String(),
		})
	}
	return profiles, nil
}
