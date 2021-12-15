package application

import (
	"log"

	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cluster_metadata_persist"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cred_resolver_config_persist"
)

var app *ServerApplication

func GetInstance() *ServerApplication {
	if app == nil {
		log.Fatalf("Application is not initialized")
	}
	return app
}

func SetApplication(appInput *ServerApplication) {
	app = appInput
}

type ServerApplication struct {
	CredResolverConfigStorage *cred_resolver_config_persist.CredResolverConfigStorage
	ClusterMetadataCacheStorage *cluster_metadata_persist.ClusterMetadataStorage
	AggreagtedClusterMetadataCacheStorage *cluster_metadata_persist.AggregatedClusterMetadataStorage
}

func (s *ServerApplication) InitApplication(option *ServerApplicationOption) error {
	s.CredResolverConfigStorage = &cred_resolver_config_persist.CredResolverConfigStorage{
		StoragePath: option.CredResolverConfigPath,
	}
	firstLoad, err := s.CredResolverConfigStorage.LoadStorage()
	if err != nil {
		return err
	}

	s.ClusterMetadataCacheStorage = &cluster_metadata_persist.ClusterMetadataStorage{
		StoragePath: option.ClusterMetadataCachePath,
	}
	_, err = s.ClusterMetadataCacheStorage.LoadStorage()
	if err != nil {
		return err
	}

	s.AggreagtedClusterMetadataCacheStorage = &cluster_metadata_persist.AggregatedClusterMetadataStorage{
		StoragePath: option.AggregatedClusterMetadataCachePath,
	}
	_, err = s.AggreagtedClusterMetadataCacheStorage.LoadStorage()
	if err != nil {
		return err
	}

	if firstLoad {
		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "548322143865",
			InfraVendor:        "AWS",
			AccountAlias:       "pubg-xtrm",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "mfa"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "418047124903",
			InfraVendor:        "AWS",
			AccountAlias:       "xtrm-newstate",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "mfan"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "350993443303",
			InfraVendor:        "AWS",
			AccountAlias:       "xtrm-playground",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "mfap"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "200019689895",
			InfraVendor:        "Tencent",
			AccountAlias:       "xtrm-newstate",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "default"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "200022166252",
			InfraVendor:        "Tencent",
			AccountAlias:       "xtrm-playground",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "dev"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "f073f292-7255-416f-adaf-34b476e050be",
			InfraVendor:        "Azure",
			AccountAlias:       "xtrm-newstate",
			Kind:               protos.CredentialResolverKind_DEFAULT,
			ResolverAttributes: map[string]string{},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SaveStorage()
		if err != nil {
			return err
		}
	}

	return nil
}

type ServerApplicationOption struct {
	CredResolverConfigPath             string
	ClusterMetadataCachePath           string
	AggregatedClusterMetadataCachePath string
}
