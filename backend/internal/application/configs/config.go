package configs

type ApplicationConfig struct {
	AutoUpdate bool
	Extensions struct {
		Fox FoxExtension
		Eks EksExtension
		Aks AksExtension
	}
}

type FoxExtension struct {
	Address  string
	UseCache bool
}

type EksExtension struct {
	UseEksRoleLogin    bool
	EksRoleNamePattern string
}

type AksExtension struct {
	UseKubelogin bool
}
