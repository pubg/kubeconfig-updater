package types

import "strings"

type InfraVendor int32

const (
	InfraVendor_AWS     InfraVendor = 0
	InfraVendor_Azure   InfraVendor = 1
	InfraVendor_Tencent InfraVendor = 2
)

var _InfraVendorNames = []string{"AWS", "Azure", "Tencent"}
var _InfraVendorValues = []InfraVendor{InfraVendor_AWS, InfraVendor_Azure, InfraVendor_Tencent}

func (v InfraVendor) String() string {
	return _InfraVendorNames[v]
}

func IsInfraVendorIgnoreCase(vendor string) bool {
	for _, name := range _InfraVendorNames {
		if strings.EqualFold(name, vendor) {
			return true
		}
	}
	return false
}

func ToInfraVendorIgnoreCase(vendor string) (InfraVendor, bool) {
	for index, name := range _InfraVendorNames {
		if strings.EqualFold(name, vendor) {
			return _InfraVendorValues[index], true
		}
	}
	return _InfraVendorValues[0], false
}

func InfraVendors() []InfraVendor {
	slice := make([]InfraVendor, len(_InfraVendorValues))
	copy(slice, _InfraVendorValues)
	return slice
}

type KnownClusterTag int32

const (
	KnownClusterTag_ClusterRegion KnownClusterTag = 0
	KnownClusterTag_ClusterId     KnownClusterTag = 1
	KnownClusterTag_ResourceGroup KnownClusterTag = 2
	KnownClusterTag_ClusterEngine KnownClusterTag = 3
)

var _KnownClusterTagsNames = []string{"ClusterRegion", "ClusterId", "ResourceGroup", "ClusterEngine"}
var _KnownClusterTagsValues = []KnownClusterTag{KnownClusterTag_ClusterRegion, KnownClusterTag_ClusterId, KnownClusterTag_ResourceGroup, KnownClusterTag_ClusterEngine}

func (v KnownClusterTag) String() string {
	return _KnownClusterTagsNames[v]
}

func IsKnownClusterTagsIgnoreCase(tag string) bool {
	for _, name := range _KnownClusterTagsNames {
		if strings.EqualFold(name, tag) {
			return true
		}
	}
	return false
}

func ToKnownClusterTagsIgnoreCase(tag string) (KnownClusterTag, bool) {
	for index, name := range _KnownClusterTagsNames {
		if strings.EqualFold(name, tag) {
			return _KnownClusterTagsValues[index], true
		}
	}
	return _KnownClusterTagsValues[0], false
}

func KnownClusterTags() []KnownClusterTag {
	slice := make([]KnownClusterTag, len(_KnownClusterTagsValues))
	copy(slice, _KnownClusterTagsValues)
	return slice
}

type KnownCredAttribute int32

const (
	KnownCredAttribute_profile KnownCredAttribute = 0
)

var _KnownCredAttributesNames = []string{"profile"}
var _KnownCredAttributesValues = []KnownCredAttribute{KnownCredAttribute_profile}

func (v KnownCredAttribute) String() string {
	return _KnownCredAttributesNames[v]
}

func IsKnownCredAttributesIgnoreCase(tag string) bool {
	for _, name := range _KnownCredAttributesNames {
		if strings.EqualFold(name, tag) {
			return true
		}
	}
	return false
}

func ToKnownCredAttributesIgnoreCase(tag string) (KnownCredAttribute, bool) {
	for index, name := range _KnownCredAttributesNames {
		if strings.EqualFold(name, tag) {
			return _KnownCredAttributesValues[index], true
		}
	}
	return _KnownCredAttributesValues[0], false
}

func KnownCredAttributes() []KnownCredAttribute {
	slice := make([]KnownCredAttribute, len(_KnownCredAttributesValues))
	copy(slice, _KnownCredAttributesValues)
	return slice
}

type KnownClusterEngine int32

const (
	KnownClusterEngine_EKS       KnownClusterEngine = 0
	KnownClusterEngine_AKS       KnownClusterEngine = 1
	KnownClusterEngine_TKE       KnownClusterEngine = 2
	KnownClusterEngine_GKE       KnownClusterEngine = 3
	KnownClusterEngine_RKE       KnownClusterEngine = 4
	KnownClusterEngine_Openshift KnownClusterEngine = 5
)

var _KnownClusterEngineNames = []string{"EKS", "AKS", "TKE", "GKE", "RKE", "Openshift"}
var _KnownClusterEngineValues = []KnownClusterEngine{KnownClusterEngine_EKS, KnownClusterEngine_AKS, KnownClusterEngine_TKE, KnownClusterEngine_GKE, KnownClusterEngine_RKE, KnownClusterEngine_Openshift}

func (v KnownClusterEngine) String() string {
	return _KnownClusterEngineNames[v]
}

func IsKnownClusterEngineIgnoreCase(tag string) bool {
	for _, name := range _KnownClusterEngineNames {
		if strings.EqualFold(name, tag) {
			return true
		}
	}
	return false
}

func ToKnownClusterEngineIgnoreCase(tag string) (KnownClusterEngine, bool) {
	for index, name := range _KnownClusterEngineNames {
		if strings.EqualFold(name, tag) {
			return _KnownClusterEngineValues[index], true
		}
	}
	return _KnownClusterEngineValues[0], false
}

func KnownClusterEngines() []KnownClusterEngine {
	slice := make([]KnownClusterEngine, len(_KnownClusterEngineValues))
	copy(slice, _KnownClusterEngineValues)
	return slice
}
