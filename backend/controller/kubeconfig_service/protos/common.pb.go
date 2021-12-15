// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0
// 	protoc        v3.17.1
// source: protos/common.proto

package protos

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type ResultCode int32

const (
	ResultCode_SUCCESS ResultCode = 0
	// 10000 Lobby or common
	ResultCode_FAILED                     ResultCode = 10001
	ResultCode_UNKNOWN                    ResultCode = 10002
	ResultCode_INVALID_ARGUMENT           ResultCode = 10003
	ResultCode_INVALID_PASSWORD           ResultCode = 10004
	ResultCode_UNAUTHORIZED               ResultCode = 10005
	ResultCode_INVALID_ACCOUNT            ResultCode = 10006
	ResultCode_UNAVAILABLE                ResultCode = 10007
	ResultCode_INTERNAL                   ResultCode = 10008
	ResultCode_CANCELED                   ResultCode = 10009
	ResultCode_NOT_FOUND                  ResultCode = 10010
	ResultCode_AUTH_TOKEN_EXPIRED         ResultCode = 10011
	ResultCode_ALREADY_LINKED_PLATFORM_ID ResultCode = 10012
	ResultCode_NO_PERMISSION_ACCOUNT      ResultCode = 10013
	ResultCode_RESTRICTED_LOGIN           ResultCode = 10014
	ResultCode_BANNED                     ResultCode = 10015
	ResultCode_UNAUTHORIZED_EMAIL         ResultCode = 10016
	ResultCode_DELETED_ACCOUNT            ResultCode = 10017
	ResultCode_SERVER_BUSY                ResultCode = 10018
	ResultCode_SERVER_SERVICE_OFF         ResultCode = 10019
	// 100000 Server Internal
	ResultCode_SERVER_NOT_RESPONSE         ResultCode = 100002
	ResultCode_SERVER_UNKNOWN              ResultCode = 100003
	ResultCode_SERVER_ABORT                ResultCode = 100004
	ResultCode_SERVER_NOT_FOUND            ResultCode = 100005
	ResultCode_SERVER_INVALID_ARGUMENT     ResultCode = 100006
	ResultCode_SERVER_OPERATION_FAILED     ResultCode = 100007
	ResultCode_SERVER_ALREADY_EXISTS       ResultCode = 100008
	ResultCode_SERVER_UNAUTHORIZED         ResultCode = 100009
	ResultCode_SERVER_NO_PERMISSION        ResultCode = 100010
	ResultCode_SERVER_INTERNAL             ResultCode = 100011
	ResultCode_SERVER_DB_UPDATE_FAILED     ResultCode = 100012
	ResultCode_SERVER_INVALID_GAME_SESSION ResultCode = 100013
)

// Enum value maps for ResultCode.
var (
	ResultCode_name = map[int32]string{
		0:      "SUCCESS",
		10001:  "FAILED",
		10002:  "UNKNOWN",
		10003:  "INVALID_ARGUMENT",
		10004:  "INVALID_PASSWORD",
		10005:  "UNAUTHORIZED",
		10006:  "INVALID_ACCOUNT",
		10007:  "UNAVAILABLE",
		10008:  "INTERNAL",
		10009:  "CANCELED",
		10010:  "NOT_FOUND",
		10011:  "AUTH_TOKEN_EXPIRED",
		10012:  "ALREADY_LINKED_PLATFORM_ID",
		10013:  "NO_PERMISSION_ACCOUNT",
		10014:  "RESTRICTED_LOGIN",
		10015:  "BANNED",
		10016:  "UNAUTHORIZED_EMAIL",
		10017:  "DELETED_ACCOUNT",
		10018:  "SERVER_BUSY",
		10019:  "SERVER_SERVICE_OFF",
		100002: "SERVER_NOT_RESPONSE",
		100003: "SERVER_UNKNOWN",
		100004: "SERVER_ABORT",
		100005: "SERVER_NOT_FOUND",
		100006: "SERVER_INVALID_ARGUMENT",
		100007: "SERVER_OPERATION_FAILED",
		100008: "SERVER_ALREADY_EXISTS",
		100009: "SERVER_UNAUTHORIZED",
		100010: "SERVER_NO_PERMISSION",
		100011: "SERVER_INTERNAL",
		100012: "SERVER_DB_UPDATE_FAILED",
		100013: "SERVER_INVALID_GAME_SESSION",
	}
	ResultCode_value = map[string]int32{
		"SUCCESS":                     0,
		"FAILED":                      10001,
		"UNKNOWN":                     10002,
		"INVALID_ARGUMENT":            10003,
		"INVALID_PASSWORD":            10004,
		"UNAUTHORIZED":                10005,
		"INVALID_ACCOUNT":             10006,
		"UNAVAILABLE":                 10007,
		"INTERNAL":                    10008,
		"CANCELED":                    10009,
		"NOT_FOUND":                   10010,
		"AUTH_TOKEN_EXPIRED":          10011,
		"ALREADY_LINKED_PLATFORM_ID":  10012,
		"NO_PERMISSION_ACCOUNT":       10013,
		"RESTRICTED_LOGIN":            10014,
		"BANNED":                      10015,
		"UNAUTHORIZED_EMAIL":          10016,
		"DELETED_ACCOUNT":             10017,
		"SERVER_BUSY":                 10018,
		"SERVER_SERVICE_OFF":          10019,
		"SERVER_NOT_RESPONSE":         100002,
		"SERVER_UNKNOWN":              100003,
		"SERVER_ABORT":                100004,
		"SERVER_NOT_FOUND":            100005,
		"SERVER_INVALID_ARGUMENT":     100006,
		"SERVER_OPERATION_FAILED":     100007,
		"SERVER_ALREADY_EXISTS":       100008,
		"SERVER_UNAUTHORIZED":         100009,
		"SERVER_NO_PERMISSION":        100010,
		"SERVER_INTERNAL":             100011,
		"SERVER_DB_UPDATE_FAILED":     100012,
		"SERVER_INVALID_GAME_SESSION": 100013,
	}
)

func (x ResultCode) Enum() *ResultCode {
	p := new(ResultCode)
	*p = x
	return p
}

func (x ResultCode) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (ResultCode) Descriptor() protoreflect.EnumDescriptor {
	return file_protos_common_proto_enumTypes[0].Descriptor()
}

func (ResultCode) Type() protoreflect.EnumType {
	return &file_protos_common_proto_enumTypes[0]
}

func (x ResultCode) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use ResultCode.Descriptor instead.
func (ResultCode) EnumDescriptor() ([]byte, []int) {
	return file_protos_common_proto_rawDescGZIP(), []int{0}
}

type CommonReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *CommonReq) Reset() {
	*x = CommonReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_protos_common_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CommonReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CommonReq) ProtoMessage() {}

func (x *CommonReq) ProtoReflect() protoreflect.Message {
	mi := &file_protos_common_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CommonReq.ProtoReflect.Descriptor instead.
func (*CommonReq) Descriptor() ([]byte, []int) {
	return file_protos_common_proto_rawDescGZIP(), []int{0}
}

type CommonRes struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Status  ResultCode `protobuf:"varint,1,opt,name=Status,proto3,enum=kubeconfig.ResultCode" json:"Status,omitempty"`
	Message string     `protobuf:"bytes,2,opt,name=Message,proto3" json:"Message,omitempty"`
}

func (x *CommonRes) Reset() {
	*x = CommonRes{}
	if protoimpl.UnsafeEnabled {
		mi := &file_protos_common_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CommonRes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CommonRes) ProtoMessage() {}

func (x *CommonRes) ProtoReflect() protoreflect.Message {
	mi := &file_protos_common_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CommonRes.ProtoReflect.Descriptor instead.
func (*CommonRes) Descriptor() ([]byte, []int) {
	return file_protos_common_proto_rawDescGZIP(), []int{1}
}

func (x *CommonRes) GetStatus() ResultCode {
	if x != nil {
		return x.Status
	}
	return ResultCode_SUCCESS
}

func (x *CommonRes) GetMessage() string {
	if x != nil {
		return x.Message
	}
	return ""
}

var File_protos_common_proto protoreflect.FileDescriptor

var file_protos_common_proto_rawDesc = []byte{
	0x0a, 0x13, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x73, 0x2f, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0a, 0x6b, 0x75, 0x62, 0x65, 0x63, 0x6f, 0x6e, 0x66, 0x69,
	0x67, 0x22, 0x0b, 0x0a, 0x09, 0x43, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x22, 0x55,
	0x0a, 0x09, 0x43, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x52, 0x65, 0x73, 0x12, 0x2e, 0x0a, 0x06, 0x53,
	0x74, 0x61, 0x74, 0x75, 0x73, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x16, 0x2e, 0x6b, 0x75,
	0x62, 0x65, 0x63, 0x6f, 0x6e, 0x66, 0x69, 0x67, 0x2e, 0x52, 0x65, 0x73, 0x75, 0x6c, 0x74, 0x43,
	0x6f, 0x64, 0x65, 0x52, 0x06, 0x53, 0x74, 0x61, 0x74, 0x75, 0x73, 0x12, 0x18, 0x0a, 0x07, 0x4d,
	0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x4d, 0x65,
	0x73, 0x73, 0x61, 0x67, 0x65, 0x2a, 0xe7, 0x05, 0x0a, 0x0a, 0x52, 0x65, 0x73, 0x75, 0x6c, 0x74,
	0x43, 0x6f, 0x64, 0x65, 0x12, 0x0b, 0x0a, 0x07, 0x53, 0x55, 0x43, 0x43, 0x45, 0x53, 0x53, 0x10,
	0x00, 0x12, 0x0b, 0x0a, 0x06, 0x46, 0x41, 0x49, 0x4c, 0x45, 0x44, 0x10, 0x91, 0x4e, 0x12, 0x0c,
	0x0a, 0x07, 0x55, 0x4e, 0x4b, 0x4e, 0x4f, 0x57, 0x4e, 0x10, 0x92, 0x4e, 0x12, 0x15, 0x0a, 0x10,
	0x49, 0x4e, 0x56, 0x41, 0x4c, 0x49, 0x44, 0x5f, 0x41, 0x52, 0x47, 0x55, 0x4d, 0x45, 0x4e, 0x54,
	0x10, 0x93, 0x4e, 0x12, 0x15, 0x0a, 0x10, 0x49, 0x4e, 0x56, 0x41, 0x4c, 0x49, 0x44, 0x5f, 0x50,
	0x41, 0x53, 0x53, 0x57, 0x4f, 0x52, 0x44, 0x10, 0x94, 0x4e, 0x12, 0x11, 0x0a, 0x0c, 0x55, 0x4e,
	0x41, 0x55, 0x54, 0x48, 0x4f, 0x52, 0x49, 0x5a, 0x45, 0x44, 0x10, 0x95, 0x4e, 0x12, 0x14, 0x0a,
	0x0f, 0x49, 0x4e, 0x56, 0x41, 0x4c, 0x49, 0x44, 0x5f, 0x41, 0x43, 0x43, 0x4f, 0x55, 0x4e, 0x54,
	0x10, 0x96, 0x4e, 0x12, 0x10, 0x0a, 0x0b, 0x55, 0x4e, 0x41, 0x56, 0x41, 0x49, 0x4c, 0x41, 0x42,
	0x4c, 0x45, 0x10, 0x97, 0x4e, 0x12, 0x0d, 0x0a, 0x08, 0x49, 0x4e, 0x54, 0x45, 0x52, 0x4e, 0x41,
	0x4c, 0x10, 0x98, 0x4e, 0x12, 0x0d, 0x0a, 0x08, 0x43, 0x41, 0x4e, 0x43, 0x45, 0x4c, 0x45, 0x44,
	0x10, 0x99, 0x4e, 0x12, 0x0e, 0x0a, 0x09, 0x4e, 0x4f, 0x54, 0x5f, 0x46, 0x4f, 0x55, 0x4e, 0x44,
	0x10, 0x9a, 0x4e, 0x12, 0x17, 0x0a, 0x12, 0x41, 0x55, 0x54, 0x48, 0x5f, 0x54, 0x4f, 0x4b, 0x45,
	0x4e, 0x5f, 0x45, 0x58, 0x50, 0x49, 0x52, 0x45, 0x44, 0x10, 0x9b, 0x4e, 0x12, 0x1f, 0x0a, 0x1a,
	0x41, 0x4c, 0x52, 0x45, 0x41, 0x44, 0x59, 0x5f, 0x4c, 0x49, 0x4e, 0x4b, 0x45, 0x44, 0x5f, 0x50,
	0x4c, 0x41, 0x54, 0x46, 0x4f, 0x52, 0x4d, 0x5f, 0x49, 0x44, 0x10, 0x9c, 0x4e, 0x12, 0x1a, 0x0a,
	0x15, 0x4e, 0x4f, 0x5f, 0x50, 0x45, 0x52, 0x4d, 0x49, 0x53, 0x53, 0x49, 0x4f, 0x4e, 0x5f, 0x41,
	0x43, 0x43, 0x4f, 0x55, 0x4e, 0x54, 0x10, 0x9d, 0x4e, 0x12, 0x15, 0x0a, 0x10, 0x52, 0x45, 0x53,
	0x54, 0x52, 0x49, 0x43, 0x54, 0x45, 0x44, 0x5f, 0x4c, 0x4f, 0x47, 0x49, 0x4e, 0x10, 0x9e, 0x4e,
	0x12, 0x0b, 0x0a, 0x06, 0x42, 0x41, 0x4e, 0x4e, 0x45, 0x44, 0x10, 0x9f, 0x4e, 0x12, 0x17, 0x0a,
	0x12, 0x55, 0x4e, 0x41, 0x55, 0x54, 0x48, 0x4f, 0x52, 0x49, 0x5a, 0x45, 0x44, 0x5f, 0x45, 0x4d,
	0x41, 0x49, 0x4c, 0x10, 0xa0, 0x4e, 0x12, 0x14, 0x0a, 0x0f, 0x44, 0x45, 0x4c, 0x45, 0x54, 0x45,
	0x44, 0x5f, 0x41, 0x43, 0x43, 0x4f, 0x55, 0x4e, 0x54, 0x10, 0xa1, 0x4e, 0x12, 0x10, 0x0a, 0x0b,
	0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x42, 0x55, 0x53, 0x59, 0x10, 0xa2, 0x4e, 0x12, 0x17,
	0x0a, 0x12, 0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x53, 0x45, 0x52, 0x56, 0x49, 0x43, 0x45,
	0x5f, 0x4f, 0x46, 0x46, 0x10, 0xa3, 0x4e, 0x12, 0x19, 0x0a, 0x13, 0x53, 0x45, 0x52, 0x56, 0x45,
	0x52, 0x5f, 0x4e, 0x4f, 0x54, 0x5f, 0x52, 0x45, 0x53, 0x50, 0x4f, 0x4e, 0x53, 0x45, 0x10, 0xa2,
	0x8d, 0x06, 0x12, 0x14, 0x0a, 0x0e, 0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x55, 0x4e, 0x4b,
	0x4e, 0x4f, 0x57, 0x4e, 0x10, 0xa3, 0x8d, 0x06, 0x12, 0x12, 0x0a, 0x0c, 0x53, 0x45, 0x52, 0x56,
	0x45, 0x52, 0x5f, 0x41, 0x42, 0x4f, 0x52, 0x54, 0x10, 0xa4, 0x8d, 0x06, 0x12, 0x16, 0x0a, 0x10,
	0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x4e, 0x4f, 0x54, 0x5f, 0x46, 0x4f, 0x55, 0x4e, 0x44,
	0x10, 0xa5, 0x8d, 0x06, 0x12, 0x1d, 0x0a, 0x17, 0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x49,
	0x4e, 0x56, 0x41, 0x4c, 0x49, 0x44, 0x5f, 0x41, 0x52, 0x47, 0x55, 0x4d, 0x45, 0x4e, 0x54, 0x10,
	0xa6, 0x8d, 0x06, 0x12, 0x1d, 0x0a, 0x17, 0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x4f, 0x50,
	0x45, 0x52, 0x41, 0x54, 0x49, 0x4f, 0x4e, 0x5f, 0x46, 0x41, 0x49, 0x4c, 0x45, 0x44, 0x10, 0xa7,
	0x8d, 0x06, 0x12, 0x1b, 0x0a, 0x15, 0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x41, 0x4c, 0x52,
	0x45, 0x41, 0x44, 0x59, 0x5f, 0x45, 0x58, 0x49, 0x53, 0x54, 0x53, 0x10, 0xa8, 0x8d, 0x06, 0x12,
	0x19, 0x0a, 0x13, 0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x55, 0x4e, 0x41, 0x55, 0x54, 0x48,
	0x4f, 0x52, 0x49, 0x5a, 0x45, 0x44, 0x10, 0xa9, 0x8d, 0x06, 0x12, 0x1a, 0x0a, 0x14, 0x53, 0x45,
	0x52, 0x56, 0x45, 0x52, 0x5f, 0x4e, 0x4f, 0x5f, 0x50, 0x45, 0x52, 0x4d, 0x49, 0x53, 0x53, 0x49,
	0x4f, 0x4e, 0x10, 0xaa, 0x8d, 0x06, 0x12, 0x15, 0x0a, 0x0f, 0x53, 0x45, 0x52, 0x56, 0x45, 0x52,
	0x5f, 0x49, 0x4e, 0x54, 0x45, 0x52, 0x4e, 0x41, 0x4c, 0x10, 0xab, 0x8d, 0x06, 0x12, 0x1d, 0x0a,
	0x17, 0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x44, 0x42, 0x5f, 0x55, 0x50, 0x44, 0x41, 0x54,
	0x45, 0x5f, 0x46, 0x41, 0x49, 0x4c, 0x45, 0x44, 0x10, 0xac, 0x8d, 0x06, 0x12, 0x21, 0x0a, 0x1b,
	0x53, 0x45, 0x52, 0x56, 0x45, 0x52, 0x5f, 0x49, 0x4e, 0x56, 0x41, 0x4c, 0x49, 0x44, 0x5f, 0x47,
	0x41, 0x4d, 0x45, 0x5f, 0x53, 0x45, 0x53, 0x53, 0x49, 0x4f, 0x4e, 0x10, 0xad, 0x8d, 0x06, 0x42,
	0x51, 0x5a, 0x4f, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x70, 0x75,
	0x62, 0x67, 0x2f, 0x6b, 0x75, 0x62, 0x65, 0x63, 0x6f, 0x6e, 0x66, 0x69, 0x67, 0x2d, 0x75, 0x70,
	0x64, 0x61, 0x74, 0x65, 0x72, 0x2f, 0x62, 0x61, 0x63, 0x6b, 0x65, 0x6e, 0x64, 0x2f, 0x63, 0x6f,
	0x6e, 0x74, 0x72, 0x6f, 0x6c, 0x6c, 0x65, 0x72, 0x2f, 0x6b, 0x75, 0x62, 0x65, 0x63, 0x6f, 0x6e,
	0x66, 0x69, 0x67, 0x5f, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_protos_common_proto_rawDescOnce sync.Once
	file_protos_common_proto_rawDescData = file_protos_common_proto_rawDesc
)

func file_protos_common_proto_rawDescGZIP() []byte {
	file_protos_common_proto_rawDescOnce.Do(func() {
		file_protos_common_proto_rawDescData = protoimpl.X.CompressGZIP(file_protos_common_proto_rawDescData)
	})
	return file_protos_common_proto_rawDescData
}

var file_protos_common_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_protos_common_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_protos_common_proto_goTypes = []interface{}{
	(ResultCode)(0),   // 0: kubeconfig.ResultCode
	(*CommonReq)(nil), // 1: kubeconfig.CommonReq
	(*CommonRes)(nil), // 2: kubeconfig.CommonRes
}
var file_protos_common_proto_depIdxs = []int32{
	0, // 0: kubeconfig.CommonRes.Status:type_name -> kubeconfig.ResultCode
	1, // [1:1] is the sub-list for method output_type
	1, // [1:1] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_protos_common_proto_init() }
func file_protos_common_proto_init() {
	if File_protos_common_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_protos_common_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CommonReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_protos_common_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CommonRes); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_protos_common_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_protos_common_proto_goTypes,
		DependencyIndexes: file_protos_common_proto_depIdxs,
		EnumInfos:         file_protos_common_proto_enumTypes,
		MessageInfos:      file_protos_common_proto_msgTypes,
	}.Build()
	File_protos_common_proto = out.File
	file_protos_common_proto_rawDesc = nil
	file_protos_common_proto_goTypes = nil
	file_protos_common_proto_depIdxs = nil
}
