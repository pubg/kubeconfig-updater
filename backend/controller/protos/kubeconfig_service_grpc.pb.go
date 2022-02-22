// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package protos

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// KubeconfigClient is the client API for Kubeconfig service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type KubeconfigClient interface {
	GetAvailableCredResolvers(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*GetCredResolversRes, error)
	SetCredResolver(ctx context.Context, in *CredResolverConfig, opts ...grpc.CallOption) (*CommonRes, error)
	SetCredResolvers(ctx context.Context, in *CredResolversReq, opts ...grpc.CallOption) (*CommonRes, error)
	DeleteCredResolver(ctx context.Context, in *DeleteCredResolverReq, opts ...grpc.CallOption) (*CommonRes, error)
	SyncAvailableCredResolvers(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*CommonRes, error)
	GetSupportedVendors(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*GetSupportedVendorsRes, error)
	GetRegisteredProfiles(ctx context.Context, in *GetRegisteredProfilesReq, opts ...grpc.CallOption) (*GetRegisteredProfilesRes, error)
	GetAvailableClusters(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*GetAvailableClustersRes, error)
	RegisterCluster(ctx context.Context, in *RegisterClusterReq, opts ...grpc.CallOption) (*CommonRes, error)
	DeleteCluster(ctx context.Context, in *DeleteClusterReq, opts ...grpc.CallOption) (*CommonRes, error)
	SyncAvailableClusters(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*CommonRes, error)
}

type kubeconfigClient struct {
	cc grpc.ClientConnInterface
}

func NewKubeconfigClient(cc grpc.ClientConnInterface) KubeconfigClient {
	return &kubeconfigClient{cc}
}

func (c *kubeconfigClient) GetAvailableCredResolvers(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*GetCredResolversRes, error) {
	out := new(GetCredResolversRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/GetAvailableCredResolvers", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) SetCredResolver(ctx context.Context, in *CredResolverConfig, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/SetCredResolver", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) SetCredResolvers(ctx context.Context, in *CredResolversReq, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/SetCredResolvers", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) DeleteCredResolver(ctx context.Context, in *DeleteCredResolverReq, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/DeleteCredResolver", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) SyncAvailableCredResolvers(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/SyncAvailableCredResolvers", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) GetSupportedVendors(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*GetSupportedVendorsRes, error) {
	out := new(GetSupportedVendorsRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/GetSupportedVendors", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) GetRegisteredProfiles(ctx context.Context, in *GetRegisteredProfilesReq, opts ...grpc.CallOption) (*GetRegisteredProfilesRes, error) {
	out := new(GetRegisteredProfilesRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/GetRegisteredProfiles", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) GetAvailableClusters(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*GetAvailableClustersRes, error) {
	out := new(GetAvailableClustersRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/GetAvailableClusters", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) RegisterCluster(ctx context.Context, in *RegisterClusterReq, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/RegisterCluster", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) DeleteCluster(ctx context.Context, in *DeleteClusterReq, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/DeleteCluster", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *kubeconfigClient) SyncAvailableClusters(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Kubeconfig/SyncAvailableClusters", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// KubeconfigServer is the server API for Kubeconfig service.
// All implementations must embed UnimplementedKubeconfigServer
// for forward compatibility
type KubeconfigServer interface {
	GetAvailableCredResolvers(context.Context, *CommonReq) (*GetCredResolversRes, error)
	SetCredResolver(context.Context, *CredResolverConfig) (*CommonRes, error)
	SetCredResolvers(context.Context, *CredResolversReq) (*CommonRes, error)
	DeleteCredResolver(context.Context, *DeleteCredResolverReq) (*CommonRes, error)
	SyncAvailableCredResolvers(context.Context, *CommonReq) (*CommonRes, error)
	GetSupportedVendors(context.Context, *CommonReq) (*GetSupportedVendorsRes, error)
	GetRegisteredProfiles(context.Context, *GetRegisteredProfilesReq) (*GetRegisteredProfilesRes, error)
	GetAvailableClusters(context.Context, *CommonReq) (*GetAvailableClustersRes, error)
	RegisterCluster(context.Context, *RegisterClusterReq) (*CommonRes, error)
	DeleteCluster(context.Context, *DeleteClusterReq) (*CommonRes, error)
	SyncAvailableClusters(context.Context, *CommonReq) (*CommonRes, error)
	mustEmbedUnimplementedKubeconfigServer()
}

// UnimplementedKubeconfigServer must be embedded to have forward compatible implementations.
type UnimplementedKubeconfigServer struct {
}

func (UnimplementedKubeconfigServer) GetAvailableCredResolvers(context.Context, *CommonReq) (*GetCredResolversRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAvailableCredResolvers not implemented")
}
func (UnimplementedKubeconfigServer) SetCredResolver(context.Context, *CredResolverConfig) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetCredResolver not implemented")
}
func (UnimplementedKubeconfigServer) SetCredResolvers(context.Context, *CredResolversReq) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetCredResolvers not implemented")
}
func (UnimplementedKubeconfigServer) DeleteCredResolver(context.Context, *DeleteCredResolverReq) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteCredResolver not implemented")
}
func (UnimplementedKubeconfigServer) SyncAvailableCredResolvers(context.Context, *CommonReq) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SyncAvailableCredResolvers not implemented")
}
func (UnimplementedKubeconfigServer) GetSupportedVendors(context.Context, *CommonReq) (*GetSupportedVendorsRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetSupportedVendors not implemented")
}
func (UnimplementedKubeconfigServer) GetRegisteredProfiles(context.Context, *GetRegisteredProfilesReq) (*GetRegisteredProfilesRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetRegisteredProfiles not implemented")
}
func (UnimplementedKubeconfigServer) GetAvailableClusters(context.Context, *CommonReq) (*GetAvailableClustersRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAvailableClusters not implemented")
}
func (UnimplementedKubeconfigServer) RegisterCluster(context.Context, *RegisterClusterReq) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RegisterCluster not implemented")
}
func (UnimplementedKubeconfigServer) DeleteCluster(context.Context, *DeleteClusterReq) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteCluster not implemented")
}
func (UnimplementedKubeconfigServer) SyncAvailableClusters(context.Context, *CommonReq) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SyncAvailableClusters not implemented")
}
func (UnimplementedKubeconfigServer) mustEmbedUnimplementedKubeconfigServer() {}

// UnsafeKubeconfigServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to KubeconfigServer will
// result in compilation errors.
type UnsafeKubeconfigServer interface {
	mustEmbedUnimplementedKubeconfigServer()
}

func RegisterKubeconfigServer(s grpc.ServiceRegistrar, srv KubeconfigServer) {
	s.RegisterService(&Kubeconfig_ServiceDesc, srv)
}

func _Kubeconfig_GetAvailableCredResolvers_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CommonReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).GetAvailableCredResolvers(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/GetAvailableCredResolvers",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).GetAvailableCredResolvers(ctx, req.(*CommonReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_SetCredResolver_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CredResolverConfig)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).SetCredResolver(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/SetCredResolver",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).SetCredResolver(ctx, req.(*CredResolverConfig))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_SetCredResolvers_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CredResolversReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).SetCredResolvers(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/SetCredResolvers",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).SetCredResolvers(ctx, req.(*CredResolversReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_DeleteCredResolver_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteCredResolverReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).DeleteCredResolver(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/DeleteCredResolver",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).DeleteCredResolver(ctx, req.(*DeleteCredResolverReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_SyncAvailableCredResolvers_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CommonReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).SyncAvailableCredResolvers(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/SyncAvailableCredResolvers",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).SyncAvailableCredResolvers(ctx, req.(*CommonReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_GetSupportedVendors_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CommonReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).GetSupportedVendors(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/GetSupportedVendors",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).GetSupportedVendors(ctx, req.(*CommonReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_GetRegisteredProfiles_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetRegisteredProfilesReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).GetRegisteredProfiles(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/GetRegisteredProfiles",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).GetRegisteredProfiles(ctx, req.(*GetRegisteredProfilesReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_GetAvailableClusters_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CommonReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).GetAvailableClusters(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/GetAvailableClusters",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).GetAvailableClusters(ctx, req.(*CommonReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_RegisterCluster_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RegisterClusterReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).RegisterCluster(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/RegisterCluster",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).RegisterCluster(ctx, req.(*RegisterClusterReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_DeleteCluster_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteClusterReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).DeleteCluster(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/DeleteCluster",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).DeleteCluster(ctx, req.(*DeleteClusterReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Kubeconfig_SyncAvailableClusters_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CommonReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(KubeconfigServer).SyncAvailableClusters(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Kubeconfig/SyncAvailableClusters",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(KubeconfigServer).SyncAvailableClusters(ctx, req.(*CommonReq))
	}
	return interceptor(ctx, in, info, handler)
}

// Kubeconfig_ServiceDesc is the grpc.ServiceDesc for Kubeconfig service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Kubeconfig_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "kubeconfig.Kubeconfig",
	HandlerType: (*KubeconfigServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetAvailableCredResolvers",
			Handler:    _Kubeconfig_GetAvailableCredResolvers_Handler,
		},
		{
			MethodName: "SetCredResolver",
			Handler:    _Kubeconfig_SetCredResolver_Handler,
		},
		{
			MethodName: "SetCredResolvers",
			Handler:    _Kubeconfig_SetCredResolvers_Handler,
		},
		{
			MethodName: "DeleteCredResolver",
			Handler:    _Kubeconfig_DeleteCredResolver_Handler,
		},
		{
			MethodName: "SyncAvailableCredResolvers",
			Handler:    _Kubeconfig_SyncAvailableCredResolvers_Handler,
		},
		{
			MethodName: "GetSupportedVendors",
			Handler:    _Kubeconfig_GetSupportedVendors_Handler,
		},
		{
			MethodName: "GetRegisteredProfiles",
			Handler:    _Kubeconfig_GetRegisteredProfiles_Handler,
		},
		{
			MethodName: "GetAvailableClusters",
			Handler:    _Kubeconfig_GetAvailableClusters_Handler,
		},
		{
			MethodName: "RegisterCluster",
			Handler:    _Kubeconfig_RegisterCluster_Handler,
		},
		{
			MethodName: "DeleteCluster",
			Handler:    _Kubeconfig_DeleteCluster_Handler,
		},
		{
			MethodName: "SyncAvailableClusters",
			Handler:    _Kubeconfig_SyncAvailableClusters_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "protos/kubeconfig_service.proto",
}

// ApplicationClient is the client API for Application service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ApplicationClient interface {
	Ping(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*CommonRes, error)
	Version(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*CommonRes, error)
	GetConfig(ctx context.Context, in *GetConfigReq, opts ...grpc.CallOption) (*GetConfigRes, error)
	SetConfig(ctx context.Context, in *SetConfigReq, opts ...grpc.CallOption) (*SetConfigRes, error)
}

type applicationClient struct {
	cc grpc.ClientConnInterface
}

func NewApplicationClient(cc grpc.ClientConnInterface) ApplicationClient {
	return &applicationClient{cc}
}

func (c *applicationClient) Ping(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Application/Ping", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *applicationClient) Version(ctx context.Context, in *CommonReq, opts ...grpc.CallOption) (*CommonRes, error) {
	out := new(CommonRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Application/Version", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *applicationClient) GetConfig(ctx context.Context, in *GetConfigReq, opts ...grpc.CallOption) (*GetConfigRes, error) {
	out := new(GetConfigRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Application/GetConfig", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *applicationClient) SetConfig(ctx context.Context, in *SetConfigReq, opts ...grpc.CallOption) (*SetConfigRes, error) {
	out := new(SetConfigRes)
	err := c.cc.Invoke(ctx, "/kubeconfig.Application/SetConfig", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ApplicationServer is the server API for Application service.
// All implementations must embed UnimplementedApplicationServer
// for forward compatibility
type ApplicationServer interface {
	Ping(context.Context, *CommonReq) (*CommonRes, error)
	Version(context.Context, *CommonReq) (*CommonRes, error)
	GetConfig(context.Context, *GetConfigReq) (*GetConfigRes, error)
	SetConfig(context.Context, *SetConfigReq) (*SetConfigRes, error)
	mustEmbedUnimplementedApplicationServer()
}

// UnimplementedApplicationServer must be embedded to have forward compatible implementations.
type UnimplementedApplicationServer struct {
}

func (UnimplementedApplicationServer) Ping(context.Context, *CommonReq) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Ping not implemented")
}
func (UnimplementedApplicationServer) Version(context.Context, *CommonReq) (*CommonRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Version not implemented")
}
func (UnimplementedApplicationServer) GetConfig(context.Context, *GetConfigReq) (*GetConfigRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetConfig not implemented")
}
func (UnimplementedApplicationServer) SetConfig(context.Context, *SetConfigReq) (*SetConfigRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetConfig not implemented")
}
func (UnimplementedApplicationServer) mustEmbedUnimplementedApplicationServer() {}

// UnsafeApplicationServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ApplicationServer will
// result in compilation errors.
type UnsafeApplicationServer interface {
	mustEmbedUnimplementedApplicationServer()
}

func RegisterApplicationServer(s grpc.ServiceRegistrar, srv ApplicationServer) {
	s.RegisterService(&Application_ServiceDesc, srv)
}

func _Application_Ping_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CommonReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ApplicationServer).Ping(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Application/Ping",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ApplicationServer).Ping(ctx, req.(*CommonReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Application_Version_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CommonReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ApplicationServer).Version(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Application/Version",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ApplicationServer).Version(ctx, req.(*CommonReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Application_GetConfig_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetConfigReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ApplicationServer).GetConfig(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Application/GetConfig",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ApplicationServer).GetConfig(ctx, req.(*GetConfigReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Application_SetConfig_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SetConfigReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ApplicationServer).SetConfig(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeconfig.Application/SetConfig",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ApplicationServer).SetConfig(ctx, req.(*SetConfigReq))
	}
	return interceptor(ctx, in, info, handler)
}

// Application_ServiceDesc is the grpc.ServiceDesc for Application service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Application_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "kubeconfig.Application",
	HandlerType: (*ApplicationServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Ping",
			Handler:    _Application_Ping_Handler,
		},
		{
			MethodName: "Version",
			Handler:    _Application_Version_Handler,
		},
		{
			MethodName: "GetConfig",
			Handler:    _Application_GetConfig_Handler,
		},
		{
			MethodName: "SetConfig",
			Handler:    _Application_SetConfig_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "protos/kubeconfig_service.proto",
}
