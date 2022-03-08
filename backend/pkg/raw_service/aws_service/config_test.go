package aws_service

import (
	"fmt"
	"testing"
)

func TestGetProfilesFromConfig(t *testing.T) {
	profiles, err := GetProfilesFromConfig()
	if err != nil {
		t.Fatal(err)
	}
	fmt.Printf("Found %d profiles from ~/.aws/config\n", len(profiles))
	for _, profile := range profiles {
		fmt.Printf("Profile: %s\n", profile)
	}
}

func TestGetProfiles(t *testing.T) {
	profiles, err := GetProfiles()
	if err != nil {
		t.Fatal(err)
	}
	fmt.Printf("Found %d profiles from ~/.aws/config\n", len(profiles))
	for _, profile := range profiles {
		fmt.Printf("Profile: %s\n", profile)
	}
}
