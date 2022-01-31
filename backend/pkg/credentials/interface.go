package credentials

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"
)

type CredResolver interface {
	GetSdkConfig(ctx context.Context) (cred interface{}, accountId string, err error)
	SupportIdentityType() types.InfraVendor
	Description() string

	// GetStatus returns: credential status, permission or api error, server internal error (ex type cast)
	GetStatus(ctx context.Context) (protos.CredentialResolverStatus, error, error)
}

type CredResolverFactory struct {
	NewCredResolverFunc func(credConf *protos.CredResolverConfig) (CredResolver, error)
}

var factories = map[types.InfraVendor]*CredResolverFactory{}

func RegisterFactory(vendor types.InfraVendor, factory *CredResolverFactory) error {
	if _, exists := factories[vendor]; exists {
		return fmt.Errorf("DuplicatedFactory: Try to Register %s Twice", vendor.String())
	}
	factories[vendor] = factory
	return nil
}

func GetFactory(vendor types.InfraVendor) (*CredResolverFactory, bool) {
	fac, exists := factories[vendor]
	return fac, exists
}

type LocalCred interface {
	GetLocalProfiles() ([]*protos.Profile, error)
}

var localCreds = map[types.InfraVendor]LocalCred{}

func RegisterLocalCred(vendor types.InfraVendor, lc LocalCred) error {
	if _, exists := localCreds[vendor]; exists {
		return fmt.Errorf("DuplicatedFactory: Try to Register %s Twice", vendor.String())
	}
	localCreds[vendor] = lc
	return nil
}

func GetLocalCred(vendor types.InfraVendor) (LocalCred, bool) {
	fac, exists := localCreds[vendor]
	return fac, exists
}

const NotSupportedCredKind = "NotSupportedCredKind: '%s'"
const InvalidAttribute = "InvalidAttribute: '%s'"

func GetProfileFromAttribute(attr map[string]string) (string, error) {
	if attr == nil {
		return "", fmt.Errorf("InvalidArguments: Attributes Should be not Null")
	}
	profile, exists := attr[types.KnownCredAttribute_profile.String()]
	if !exists {
		return "", fmt.Errorf(InvalidAttribute, fmt.Sprintf("NotFound %s Field", types.KnownCredAttribute_profile.String()))
	}
	if profile == "" {
		return "", fmt.Errorf(InvalidAttribute, "Profile Should be not Empty")
	}
	return profile, nil
}
