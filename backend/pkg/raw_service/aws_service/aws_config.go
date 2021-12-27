package aws_service

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sts"
	"github.com/pubg/kubeconfig-updater/backend/internal/types"
	"os"
	"path/filepath"

	"github.com/pubg/kubeconfig-updater/backend/internal/common"
	"gopkg.in/ini.v1"
)

func GetProfiles() ([]string, error) {
	profilesMap := make(map[string]struct{})

	cfgProfiles, err := GetProfilesFromConfig()
	if err != nil {
		return nil, err
	}

	for _, profile := range cfgProfiles {
		var actualProfileName string

		if profile == "default" {
			actualProfileName = profile
		} else {
			_, err = fmt.Sscanf(profile, "profile %s", &actualProfileName)
			if err != nil {
				return nil, err
			}
		}

		profilesMap[actualProfileName] = struct{}{}
	}

	credProfiles, err := GetProfilesFromCredentials()
	if err != nil {
		return nil, err
	}

	for _, profile := range credProfiles {
		profilesMap[profile] = struct{}{}
	}

	var profiles []string
	for profile := range profilesMap {
		profiles = append(profiles, profile)
	}

	return profiles, nil
}

func GetProfilesFromConfig() ([]string, error) {
	awsDir, err := getAwsDirectoryPath()
	if err != nil {
		return nil, err
	}

	configPath := filepath.Join(awsDir, "config")

	bytes, err := os.ReadFile(configPath)
	if err != nil {
		return nil, err
	}

	var profileNames []string

	cfg, err := ini.Load(bytes)
	if err != nil {
		return nil, err
	}

	for _, section := range cfg.Sections() {
		if section.Name() != "DEFAULT" {
			// we don't need "DEFAULT", so omit this.
			profileNames = append(profileNames, section.Name())
		}
	}

	return profileNames, nil
}

func GetProfilesFromCredentials() ([]string, error) {
	awsDir, err := getAwsDirectoryPath()
	if err != nil {
		return nil, err
	}

	configPath := filepath.Join(awsDir, "credentials")

	bytes, err := os.ReadFile(configPath)
	if err != nil {
		return nil, err
	}

	var profileNames []string
	cfg, err := ini.Load(bytes)
	if err != nil {
		return nil, err
	}

	for _, section := range cfg.Sections() {
		if section.Name() != "DEFAULT" {
			profileNames = append(profileNames, section.Name())
		}
	}

	return profileNames, nil
}

func getAwsDirectoryPath() (string, error) {
	return common.ResolvePathToAbs(filepath.Join("~", ".aws"))
}

// GetConfigInfo returns: AccountId, CredIsNotValid, error
// CredIsNotValid => config is not valid aws credential
func GetConfigInfo(cfg *aws.Config) (string, bool, error) {
	copiedCfg := cfg.Copy()
	copiedCfg.Region = types.AWS_DEFAULT_REGION
	client := sts.NewFromConfig(copiedCfg)
	out, err := client.GetCallerIdentity(context.Background(), &sts.GetCallerIdentityInput{})
	if err != nil {
		return "", false, err
	}
	return *out.Account, true, err
}
