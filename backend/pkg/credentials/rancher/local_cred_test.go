package rancher

import (
	"fmt"
	"testing"
)

func TestLocalCred_GetLocalProfiles(t *testing.T) {
	lc := &LocalCred{}
	profiles, err := lc.GetLocalProfiles()
	if err != nil {
		t.Error(err)
	}

	for _, profile := range profiles {
		fmt.Printf("%+v\n", profile)
	}
}