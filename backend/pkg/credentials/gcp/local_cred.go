package gcp

import (
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/credentials"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/gcp_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
	"log"
)

func init() {
	if err := credentials.RegisterLocalCred(types.InfraVendor_GCP, &LocalCred{}); err != nil {
		log.Fatalln(err)
	}
}

type LocalCred struct {
}

func (a *LocalCred) GetLocalProfiles() ([]*protos.Profile, error) {
	cfgs, err := gcp_service.GetConfigs()
	if err != nil {
		return nil, err
	}
	var profiles []*protos.Profile
	for _, cfg := range cfgs {
		var projectName string
		if cfg.Properties.Core.Project == nil {
			projectName = ""
		} else {
			projectName = *cfg.Properties.Core.Project
		}

		profiles = append(profiles, &protos.Profile{
			ProfileName: cfg.Name,
			AccountId:   projectName,
			InfraVendor: types.InfraVendor_GCP.String(),
		})
	}

	return profiles, nil
}
