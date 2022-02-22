package raw_config_service

import (
	"gopkg.in/yaml.v3"
	"io/ioutil"
)

type BackendConfigProvider struct {
	AbsPath string
}

func (p *BackendConfigProvider) Name() string {
	return "Backend-Config"
}

func (p *BackendConfigProvider) GetConfig() (*string, error) {
	data, err := ioutil.ReadFile(p.AbsPath)
	if err != nil {
		return nil, err
	}

	str := string(data)

	return &str, nil
}

func (p *BackendConfigProvider) SetConfig(data string) error {
	out := make(map[string]interface{})
	err := yaml.Unmarshal([]byte(data), &out)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(p.AbsPath, []byte(data), 0644)
}
