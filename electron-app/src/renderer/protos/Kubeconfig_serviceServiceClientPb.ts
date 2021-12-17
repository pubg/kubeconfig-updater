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

  methodInfoGetKubeConfig = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/GetKubeConfig',
    grpcWeb.MethodType.UNARY,
    protos_common_pb.CommonReq,
    protos_kubeconfig_service_pb.KubeConfigRes,
    (request: protos_common_pb.CommonReq) => {
      return request.serializeBinary();
    },
    protos_kubeconfig_service_pb.KubeConfigRes.deserializeBinary
  );

  getKubeConfig(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_kubeconfig_service_pb.KubeConfigRes>;

  getKubeConfig(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.KubeConfigRes) => void): grpcWeb.ClientReadableStream<protos_kubeconfig_service_pb.KubeConfigRes>;

  getKubeConfig(
    request: protos_common_pb.CommonReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_kubeconfig_service_pb.KubeConfigRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/GetKubeConfig',
        request,
        metadata || {},
        this.methodInfoGetKubeConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/GetKubeConfig',
    request,
    metadata || {},
    this.methodInfoGetKubeConfig);
  }

  methodInfoSetKubeConfig = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/SetKubeConfig',
    grpcWeb.MethodType.UNARY,
    protos_kubeconfig_service_pb.KubeConfigReq,
    protos_common_pb.CommonRes,
    (request: protos_kubeconfig_service_pb.KubeConfigReq) => {
      return request.serializeBinary();
    },
    protos_common_pb.CommonRes.deserializeBinary
  );

  setKubeConfig(
    request: protos_kubeconfig_service_pb.KubeConfigReq,
    metadata: grpcWeb.Metadata | null): Promise<protos_common_pb.CommonRes>;

  setKubeConfig(
    request: protos_kubeconfig_service_pb.KubeConfigReq,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void): grpcWeb.ClientReadableStream<protos_common_pb.CommonRes>;

  setKubeConfig(
    request: protos_kubeconfig_service_pb.KubeConfigReq,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: protos_common_pb.CommonRes) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/kubeconfig.Kubeconfig/SetKubeConfig',
        request,
        metadata || {},
        this.methodInfoSetKubeConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/SetKubeConfig',
    request,
    metadata || {},
    this.methodInfoSetKubeConfig);
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

  methodInfoPing = new grpcWeb.MethodDescriptor(
    '/kubeconfig.Kubeconfig/Ping',
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
          '/kubeconfig.Kubeconfig/Ping',
        request,
        metadata || {},
        this.methodInfoPing,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/kubeconfig.Kubeconfig/Ping',
    request,
    metadata || {},
    this.methodInfoPing);
  }

}

