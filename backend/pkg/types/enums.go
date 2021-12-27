//go:generate protoc --go_out=./ --go_opt=paths=source_relative ./enums.proto

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

type KnownClusterTags int32

const (
	KnownClusterTags_ClusterRegion KnownClusterTags = 0
	KnownClusterTags_ClusterId     KnownClusterTags = 1
	KnownClusterTags_ResourceGroup KnownClusterTags = 2
)

var _KnownClusterTagsNames = []string{"ClusterRegion", "ClusterId", "ResourceGroup"}
var _KnownClusterTagsValues = []KnownClusterTags{KnownClusterTags_ClusterRegion, KnownClusterTags_ClusterId, KnownClusterTags_ResourceGroup}

func (v KnownClusterTags) String() string {
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

func ToKnownClusterTagsIgnoreCase(tag string) (KnownClusterTags, bool) {
	for index, name := range _KnownClusterTagsNames {
		if strings.EqualFold(name, tag) {
			return _KnownClusterTagsValues[index], true
		}
	}
	return _KnownClusterTagsValues[0], false
}

type KnownCredAttributes int32

const (
	KnownCredAttributes_profile KnownCredAttributes = 0
)

var _KnownCredAttributesNames = []string{"profile"}
var _KnownCredAttributesValues = []KnownCredAttributes{KnownCredAttributes_profile}

func (v KnownCredAttributes) String() string {
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

func ToKnownCredAttributesIgnoreCase(tag string) (KnownCredAttributes, bool) {
	for index, name := range _KnownCredAttributesNames {
		if strings.EqualFold(name, tag) {
			return _KnownCredAttributesValues[index], true
		}
	}
	return _KnownCredAttributesValues[0], false
}
