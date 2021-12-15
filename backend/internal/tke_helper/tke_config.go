package tke_helper

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

func GetProfiles() ([]string, error) {
	// TODO: intl 는 .tccli, china 버전은 .tencentcloud 참조함
	profileNames := make([]string, 0)

	dirPath := getCredentialsDirectoryPath()

	dir, err := os.Stat(dirPath)
	if err != nil {
		return nil, err
	} else if !dir.IsDir() {
		return nil, err
	}

	files, err := ioutil.ReadDir(dirPath)
	if err != nil {
		return nil, err
	}

	for _, file := range files {
		name := file.Name()
		ext := ".credential"
		if strings.HasSuffix(name, ext) {
			profileName := strings.TrimSuffix(name, ext)
			profileNames = append(profileNames, profileName)
		}
	}

	return profileNames, nil
}

// DefaultProfileProvider return a default Profile  provider
// profile path :
//  1. The value of the environment variable TENCENTCLOUD_CREDENTIALS_FILE
//  2. linux: ~/.tencentcloud/credentials
// 	  windows: \c:\Users\NAME\.tencentcloud\credentials

// getHomePath return home directory according to the system.
// if the environmental variables does not exist, it will return empty string
func getHomePath() string {
	// Windows
	if runtime.GOOS == "windows" {
		return os.Getenv("USERPROFILE")
	}
	// *nix
	return os.Getenv("HOME")
}

func getCredentialsDirectoryPath() string {
	homePath := getHomePath()
	if homePath == "" {
		return homePath
	}
	return filepath.Join(homePath, ".tccli")
}
