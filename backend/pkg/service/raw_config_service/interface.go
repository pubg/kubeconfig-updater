package raw_config_service

type ConfigProvider interface {
	Name() string
	GetConfig() (*string, error)
	SetConfig(data string) error
}
