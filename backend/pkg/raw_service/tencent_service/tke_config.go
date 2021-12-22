package tencent_service

import (
	"io/ioutil"
	"os"
	"strings"

	"github.com/pubg/kubeconfig-updater/backend/internal/common"
)

func GetProfiles() ([]string, error) {
	// TODO: intl 는 .tccli, china 버전은 .tencentcloud 참조함
	profileNames := make([]string, 0)

	dirPath, err := getCredentialsDirectoryPath()
	if err != nil {
		return nil, err
	}

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

func getCredentialsDirectoryPath() (string, error) {
	path, err := common.ResolvePathToAbs("~/.tccli")
	return path, err
}
