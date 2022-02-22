package configs

import "io/ioutil"

type RawConfigProvider struct {
	AbsPath string
}

func (p *RawConfigProvider) Name() string {
	return "Application-Config"
}

func (p *RawConfigProvider) GetConfig() (*string, error) {
	data, err := ioutil.ReadFile(p.AbsPath)
	if err != nil {
		return nil, err
	}

	str := string(data)

	return &str, nil
}

func (p *RawConfigProvider) SetConfig(data string) error {
	return ioutil.WriteFile(p.AbsPath, []byte(data), 0644)
}
