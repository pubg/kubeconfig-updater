package configs

type ApplicationConfig struct {
	DataStores                *DataStores `yaml:"DataStores,omitempty" json:"DataStores,omitempty"`
	AutoUpdate                bool
	Extensions                *Extension
	DefaultCredResolverConfig string
}

type DataStores struct {
	AggregatedClusterMetadata *DataStoreConfig
	CredResolverConfig        *DataStoreConfig
}

type DataStoreConfig struct {
	Path string
}

type Extension struct {
	Fox              *FoxExt
	EksAssumeRoles   []*EksAssumeRoleExt
	AksBrowserLogins []*AksBrowserLoginExt
	LensRegister     []*LensRegisterExt
}

type FoxExt struct {
	Enable  bool
	Address string
}

type EksAssumeRoleExt struct {
	// StringExpression
	RoleNameExpression      Expression
	ClusterFilterExpression Expression
}

type AksBrowserLoginExt struct {
	ClusterFilterExpression Expression
}

type LensRegisterExt struct {
	ClusterFilterExpression Expression
	PrometheusEndpoint      string
}

// String expression: Format, GoTemplate
// Validation expression: Regex, GoTemplate, Glob

type Expression struct {
	Type       string
	Expression string
}
