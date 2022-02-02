package rancher

import (
	"context"
	"fmt"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"testing"
)

func TestNewRancherResolver(t *testing.T) {
	cfg := &protos.CredResolverConfig{
		AccountId:    "asdf",
		InfraVendor:  "rancher",
		AccountAlias: "rrrr",
		Kind:         protos.CredentialResolverKind_DEFAULT,
	}

	res, err := NewRancherResolver(cfg)
	if err != nil {
		t.Errorf(err.Error())
	}

	status, userErr, err := res.GetStatus(context.TODO())
	if err != nil {
		t.Errorf("InternalError:%s\n", err.Error())
	}
	if userErr != nil {
		t.Errorf("UserError:%s\n", userErr.Error())
	}

	fmt.Printf("Status: %s\n", status.String())
}
