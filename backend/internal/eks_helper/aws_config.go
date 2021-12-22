package eks_helper

import (
	"fmt"
	"gopkg.in/ini.v1"
	"os"
	"path/filepath"
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
	awsDir, err := getAWSDirectoryPath()
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
	awsDir, err := getAWSDirectoryPath()
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

func getAWSDirectoryPath() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	configPath := filepath.Join(homeDir, ".aws")

	return configPath, nil
}
