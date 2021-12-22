package configs

type ApplicationConfig struct {
	DataStores *DataStores
	AutoUpdate bool
	Extensions *Extension
}

type DataStores struct {
	AggregatedClusterMetadata *DataStoreConfig
	CredResolverConfig        *DataStoreConfig
}

type DataStoreConfig struct {
	Path string
}

type Extension struct {
	Fox *FoxExtension
	Eks *EksExtension
	Aks *AksExtension
}

type FoxExtension struct {
	Enable  bool
	Address string
	//TODO
	UseCache bool
}

//TODO
type EksExtension struct {
	UseEksRoleLogin    bool
	EksRoleNamePattern string
}

//TODO
type AksExtension struct {
	UseKubelogin bool
}
