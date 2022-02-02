package rancher

import (
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/rancher_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"log"
)

func init() {
	if err := credentials.RegisterLocalCred(types.InfraVendor_Rancher, &LocalCred{}); err != nil {
		log.Fatalln(err)
	}
}

type LocalCred struct {
}

func (a *LocalCred) GetLocalProfiles() ([]*protos.Profile, error) {
	cfg, err := rancher_service.LoadConfig()
	if err != nil {
		return nil, err
	}
	var profiles []*protos.Profile
	for name, serverConfig := range cfg.Servers {
		profiles = append(profiles, &protos.Profile{
			ProfileName: name,
			AccountId:   serverConfig.URL,
			InfraVendor: types.InfraVendor_Rancher.String(),
		})
	}

	return profiles, nil
}
