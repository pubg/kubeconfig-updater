package tencent_service

import (
	"fmt"
	"testing"
)

func TestGetProfiles(t *testing.T) {
	profiles, err := GetProfiles()
	if err != nil {
		t.Fatal(err)
	}
	fmt.Printf("Found %d profiles from ~/.tccli/*\n", len(profiles))
	for _, profile := range profiles {
		fmt.Printf("Profile: %s\n", profile)
	}
}
