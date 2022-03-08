package aws_service

import (
	"context"
	"errors"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/aws/retry"
	"github.com/aws/aws-sdk-go-v2/service/sts"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/types"

	"os"
	"path/filepath"

	"gopkg.in/ini.v1"
)

func GetProfiles() ([]string, error) {
	profilesMap := make(map[string]struct{})

	cfgProfiles, err := GetProfilesFromConfig()
	if err != nil {
		return nil, err
	}

	for _, profile := range cfgProfiles {
		profilesMap[profile] = struct{}{}
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

	bytes, err := os.ReadFile(filepath.Join(awsDir, "config"))
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	cfg, err := ini.Load(bytes)
	if err != nil {
		return nil, err
	}

	var profileNames []string
	for _, section := range cfg.Sections() {
		if section.Name() == ini.DefaultSection {
			continue
		}

		profileName := section.Name()
		if strings.HasPrefix(profileName, "profile ") {
			profileName = strings.Replace(profileName, "profile ", "", 1)
		}
		profileNames = append(profileNames, profileName)
	}

	return profileNames, nil
}

func GetProfilesFromCredentials() ([]string, error) {
	awsDir, err := getAwsDirectoryPath()
	if err != nil {
		return nil, err
	}

	bytes, err := os.ReadFile(filepath.Join(awsDir, "credentials"))
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	cfg, err := ini.Load(bytes)
	if err != nil {
		return nil, err
	}

	var profileNames []string
	for _, section := range cfg.Sections() {
		if section.Name() == ini.DefaultSection {
			continue
		}
		profileNames = append(profileNames, section.Name())
	}

	return profileNames, nil
}

func getAwsDirectoryPath() (string, error) {
	return common.ResolvePathToAbs(filepath.Join("~", ".aws"))
}

// GetConfigInfo returns: AccountId, error
func GetConfigInfo(cfg *aws.Config) (string, error) {
	copiedCfg := cfg.Copy()
	copiedCfg.Region = types.AWS_DEFAULT_REGION
	copiedCfg.Retryer = func() aws.Retryer {
		return retry.AddWithMaxAttempts(retry.NewStandard(), 1)
	}
	client := sts.NewFromConfig(copiedCfg)
	out, err := client.GetCallerIdentity(context.Background(), &sts.GetCallerIdentityInput{})
	if err != nil {
		return "", err
	}
	return *out.Account, nil
}
