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
	AksBrowserLogins []*AksBrowserLogin
}

type EksAssumeRoleExt struct {
	// StringExpression
	RoleNameExpression      Expression
	ClusterFilterExpression Expression
}

type AksBrowserLogin struct {
	ClusterFilterExpression Expression
}

type FoxExt struct {
	Enable  bool
	Address string
}

// String Expression: String Format, GoText
// Validation Expression: Regex, GoText, Glob

type Expression struct {
	Type       string
	Expression string
}
