/**
 * @fileoverview gRPC-Web generated client stub for kubeconfig
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as protos_common_pb from '../protos/common_pb';
import * as protos_kubeconfig_service_pb from '../protos/kubeconfig_service_pb';


export class KubeconfigClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetAvailableCredResolvers = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/GetAvailableCredResolvers',
    grpcWeb.MethodType.UNARY,
    protos_common_pb.CommonReq,
    protos_kubeconfig_service_pb.GetCredResolversRes,
    (request: protos_common_pb.CommonReq) => {
      return request.serializeBinary();
    },
    protos_kubeconfig_service_pb.GetCredResolversRes.deserializeBinary
  );

  getAvailableCredResolvers(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_kubeconfig_service_pb.GetCredResolversRes>;

  getAvailableCredResolvers(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetCredResolversRes) => void): grpcWeb.ClientReadableStream<protos_kubeconfig_service_pb.GetCredResolversRes>;

  getAvailableCredResolvers(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetCredResolversRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/GetAvailableCredResolvers',
        request,
        metadata || {},
        this.methodInfoGetAvailableCredResolvers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/GetAvailableCredResolvers',
    request,
    metadata || {},
    this.methodInfoGetAvailableCredResolvers);
  }

  methodInfoSetCredResolver = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/SetCredResolver',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.CredResolverConfig,
    protos_common_pb.CommonRes,
    (request: protos_kubeconfig_service_pb.CredResolverConfig) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  setCredResolver(
    request: protos_kubeconfig_service_pb.CredResolverConfig,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  setCredResolver(
    request: protos_kubeconfig_service_pb.CredResolverConfig,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  setCredResolver(
    request: protos_kubeconfig_service_pb.CredResolverConfig,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/SetCredResolver',
        request,
        metadata || {},
        this.methodInfoSetCredResolver,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/SetCredResolver',
    request,
    metadata || {},
    this.methodInfoSetCredResolver);
  }

  methodInfoSetCredResolvers = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/SetCredResolvers',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.CredResolversReq,
    protos_common_pb.CommonRes,
    (request: protos_kubeconfig_service_pb.CredResolversReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  setCredResolvers(
    request: protos_kubeconfig_service_pb.CredResolversReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  setCredResolvers(
    request: protos_kubeconfig_service_pb.CredResolversReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  setCredResolvers(
    request: protos_kubeconfig_service_pb.CredResolversReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/SetCredResolvers',
        request,
        metadata || {},
        this.methodInfoSetCredResolvers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/SetCredResolvers',
    request,
    metadata || {},
    this.methodInfoSetCredResolvers);
  }

  methodInfoDeleteCredResolver = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/DeleteCredResolver',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.DeleteCredResolverReq,
    protos_common_pb.CommonRes,
    (request: protos_kubeconfig_service_pb.DeleteCredResolverReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  deleteCredResolver(
    request: protos_kubeconfig_service_pb.DeleteCredResolverReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  deleteCredResolver(
    request: protos_kubeconfig_service_pb.DeleteCredResolverReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  deleteCredResolver(
    request: protos_kubeconfig_service_pb.DeleteCredResolverReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/DeleteCredResolver',
        request,
        metadata || {},
        this.methodInfoDeleteCredResolver,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/DeleteCredResolver',
    request,
    metadata || {},
    this.methodInfoDeleteCredResolver);
  }

  methodInfoSyncAvailableCredResolvers = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/SyncAvailableCredResolvers',
    grpcWeb.MethodType.UNARY,
    protos_common_pb.CommonReq,
    protos_common_pb.CommonRes,
    (request: protos_common_pb.CommonReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  syncAvailableCredResolvers(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  syncAvailableCredResolvers(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  syncAvailableCredResolvers(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/SyncAvailableCredResolvers',
        request,
        metadata || {},
        this.methodInfoSyncAvailableCredResolvers,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/SyncAvailableCredResolvers',
    request,
    metadata || {},
    this.methodInfoSyncAvailableCredResolvers);
  }

  methodInfoGetSupportedVendors = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/GetSupportedVendors',
    grpcWeb.MethodType.UNARY,
    protos_common_pb.CommonReq,
    protos_kubeconfig_service_pb.GetSupportedVendorsRes,
    (request: protos_common_pb.CommonReq) => {
      return request.serializeBinary();
    },
    protos_kubeconfig_service_pb.GetSupportedVendorsRes.deserializeBinary
  );

  getSupportedVendors(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_kubeconfig_service_pb.GetSupportedVendorsRes>;

  getSupportedVendors(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetSupportedVendorsRes) => void): grpcWeb.ClientReadableStream<protos_kubeconfig_service_pb.GetSupportedVendorsRes>;

  getSupportedVendors(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetSupportedVendorsRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/GetSupportedVendors',
        request,
        metadata || {},
        this.methodInfoGetSupportedVendors,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/GetSupportedVendors',
    request,
    metadata || {},
    this.methodInfoGetSupportedVendors);
  }

  methodInfoGetRegisteredProfiles = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/GetRegisteredProfiles',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.GetRegisteredProfilesReq,
    protos_kubeconfig_service_pb.GetRegisteredProfilesRes,
    (request: protos_kubeconfig_service_pb.GetRegisteredProfilesReq) => {
      return request.serializeBinary();
    },
    protos_kubeconfig_service_pb.GetRegisteredProfilesRes.deserializeBinary
  );

  getRegisteredProfiles(
    request: protos_kubeconfig_service_pb.GetRegisteredProfilesReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_kubeconfig_service_pb.GetRegisteredProfilesRes>;

  getRegisteredProfiles(
    request: protos_kubeconfig_service_pb.GetRegisteredProfilesReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetRegisteredProfilesRes) => void): grpcWeb.ClientReadableStream<protos_kubeconfig_service_pb.GetRegisteredProfilesRes>;

  getRegisteredProfiles(
    request: protos_kubeconfig_service_pb.GetRegisteredProfilesReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetRegisteredProfilesRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/GetRegisteredProfiles',
        request,
        metadata || {},
        this.methodInfoGetRegisteredProfiles,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/GetRegisteredProfiles',
    request,
    metadata || {},
    this.methodInfoGetRegisteredProfiles);
  }

  methodInfoGetAvailableClusters = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/GetAvailableClusters',
    grpcWeb.MethodType.UNARY,
    protos_common_pb.CommonReq,
    protos_kubeconfig_service_pb.GetAvailableClustersRes,
    (request: protos_common_pb.CommonReq) => {
      return request.serializeBinary();
    },
    protos_kubeconfig_service_pb.GetAvailableClustersRes.deserializeBinary
  );

  getAvailableClusters(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_kubeconfig_service_pb.GetAvailableClustersRes>;

  getAvailableClusters(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetAvailableClustersRes) => void): grpcWeb.ClientReadableStream<protos_kubeconfig_service_pb.GetAvailableClustersRes>;

  getAvailableClusters(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetAvailableClustersRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/GetAvailableClusters',
        request,
        metadata || {},
        this.methodInfoGetAvailableClusters,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/GetAvailableClusters',
    request,
    metadata || {},
    this.methodInfoGetAvailableClusters);
  }

  methodInfoRegisterCluster = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/RegisterCluster',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.RegisterClusterReq,
    protos_common_pb.CommonRes,
    (request: protos_kubeconfig_service_pb.RegisterClusterReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  registerCluster(
    request: protos_kubeconfig_service_pb.RegisterClusterReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  registerCluster(
    request: protos_kubeconfig_service_pb.RegisterClusterReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  registerCluster(
    request: protos_kubeconfig_service_pb.RegisterClusterReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/RegisterCluster',
        request,
        metadata || {},
        this.methodInfoRegisterCluster,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/RegisterCluster',
    request,
    metadata || {},
    this.methodInfoRegisterCluster);
  }

  methodInfoDeleteCluster = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/DeleteCluster',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.DeleteClusterReq,
    protos_common_pb.CommonRes,
    (request: protos_kubeconfig_service_pb.DeleteClusterReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  deleteCluster(
    request: protos_kubeconfig_service_pb.DeleteClusterReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  deleteCluster(
    request: protos_kubeconfig_service_pb.DeleteClusterReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  deleteCluster(
    request: protos_kubeconfig_service_pb.DeleteClusterReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/DeleteCluster',
        request,
        metadata || {},
        this.methodInfoDeleteCluster,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/DeleteCluster',
    request,
    metadata || {},
    this.methodInfoDeleteCluster);
  }

  methodInfoSyncAvailableClusters = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/SyncAvailableClusters',
    grpcWeb.MethodType.UNARY,
    protos_common_pb.CommonReq,
    protos_common_pb.CommonRes,
    (request: protos_common_pb.CommonReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  syncAvailableClusters(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  syncAvailableClusters(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  syncAvailableClusters(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/SyncAvailableClusters',
        request,
        metadata || {},
        this.methodInfoSyncAvailableClusters,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/SyncAvailableClusters',
    request,
    metadata || {},
    this.methodInfoSyncAvailableClusters);
  }

}

export class ApplicationClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoPing = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Application/Ping',
    grpcWeb.MethodType.UNARY,
    protos_common_pb.CommonReq,
    protos_common_pb.CommonRes,
    (request: protos_common_pb.CommonReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  ping(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  ping(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  ping(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Application/Ping',
        request,
        metadata || {},
        this.methodInfoPing,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Application/Ping',
    request,
    metadata || {},
    this.methodInfoPing);
  }

  methodInfoVersion = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Application/Version',
    grpcWeb.MethodType.UNARY,
    protos_common_pb.CommonReq,
    protos_common_pb.CommonRes,
    (request: protos_common_pb.CommonReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  version(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  version(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  version(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Application/Version',
        request,
        metadata || {},
        this.methodInfoVersion,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Application/Version',
    request,
    metadata || {},
    this.methodInfoVersion);
  }

  methodInfoGetConfig = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Application/GetConfig',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.GetConfigReq,
    protos_kubeconfig_service_pb.GetConfigRes,
    (request: protos_kubeconfig_service_pb.GetConfigReq) => {
      return request.serializeBinary();
    },
    protos_kubeconfig_service_pb.GetConfigRes.deserializeBinary
  );

  getConfig(
    request: protos_kubeconfig_service_pb.GetConfigReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_kubeconfig_service_pb.GetConfigRes>;

  getConfig(
    request: protos_kubeconfig_service_pb.GetConfigReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetConfigRes) => void): grpcWeb.ClientReadableStream<protos_kubeconfig_service_pb.GetConfigRes>;

  getConfig(
    request: protos_kubeconfig_service_pb.GetConfigReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.GetConfigRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Application/GetConfig',
        request,
        metadata || {},
        this.methodInfoGetConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Application/GetConfig',
    request,
    metadata || {},
    this.methodInfoGetConfig);
  }

  methodInfoSetConfig = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Application/SetConfig',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.SetConfigReq,
    protos_common_pb.CommonRes,
    (request: protos_kubeconfig_service_pb.SetConfigReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  setConfig(
    request: protos_kubeconfig_service_pb.SetConfigReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  setConfig(
    request: protos_kubeconfig_service_pb.SetConfigReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  setConfig(
    request: protos_kubeconfig_service_pb.SetConfigReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Application/SetConfig',
        request,
        metadata || {},
        this.methodInfoSetConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Application/SetConfig',
    request,
    metadata || {},
    this.methodInfoSetConfig);
  }

}

