package configs

type ApplicationConfig struct {
	DataStores struct {
		AggregatedClusterMetadata DataStoreConfig
		CredResolverConfig        DataStoreConfig
	}
	AutoUpdate bool
	Extensions struct {
		Fox FoxExtension
		Eks EksExtension
		Aks AksExtension
	}
}

type DataStoreConfig struct {
	Path string
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
