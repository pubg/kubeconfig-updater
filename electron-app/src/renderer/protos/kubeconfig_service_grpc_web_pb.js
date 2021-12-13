/**
 * @fileoverview gRPC-Web generated client stub for kubeconfig
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var protos_common_pb = require('../protos/common_pb.js')
const proto = {};
proto.kubeconfig = require('./kubeconfig_service_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.kubeconfig.KubeconfigClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.kubeconfig.KubeconfigPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.kubeconfig.CommonReq,
 *   !proto.kubeconfig.GetCredResolversRes>}
 */
const methodDescriptor_Kubeconfig_GetAvailableCredResolvers = new grpc.web.MethodDescriptor(
  '/kubeconfig.Kubeconfig/GetAvailableCredResolvers',
  grpc.web.MethodType.UNARY,
  protos_common_pb.CommonReq,
  proto.kubeconfig.GetCredResolversRes,
  /**
   * @param {!proto.kubeconfig.CommonReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.kubeconfig.GetCredResolversRes.deserializeBinary
);


/**
 * @param {!proto.kubeconfig.CommonReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.kubeconfig.GetCredResolversRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.kubeconfig.GetCredResolversRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.kubeconfig.KubeconfigClient.prototype.getAvailableCredResolvers =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/GetAvailableCredResolvers',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_GetAvailableCredResolvers,
      callback);
};


/**
 * @param {!proto.kubeconfig.CommonReq} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.kubeconfig.GetCredResolversRes>}
 *     Promise that resolves to the response
 */
proto.kubeconfig.KubeconfigPromiseClient.prototype.getAvailableCredResolvers =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/GetAvailableCredResolvers',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_GetAvailableCredResolvers);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.kubeconfig.CredResolverConfig,
 *   !proto.kubeconfig.CommonRes>}
 */
const methodDescriptor_Kubeconfig_SetCredResolver = new grpc.web.MethodDescriptor(
  '/kubeconfig.Kubeconfig/SetCredResolver',
  grpc.web.MethodType.UNARY,
  proto.kubeconfig.CredResolverConfig,
  protos_common_pb.CommonRes,
  /**
   * @param {!proto.kubeconfig.CredResolverConfig} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  protos_common_pb.CommonRes.deserializeBinary
);


/**
 * @param {!proto.kubeconfig.CredResolverConfig} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.kubeconfig.CommonRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.kubeconfig.CommonRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.kubeconfig.KubeconfigClient.prototype.setCredResolver =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/SetCredResolver',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_SetCredResolver,
      callback);
};


/**
 * @param {!proto.kubeconfig.CredResolverConfig} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.kubeconfig.CommonRes>}
 *     Promise that resolves to the response
 */
proto.kubeconfig.KubeconfigPromiseClient.prototype.setCredResolver =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/SetCredResolver',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_SetCredResolver);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.kubeconfig.CredResolversReq,
 *   !proto.kubeconfig.CommonRes>}
 */
const methodDescriptor_Kubeconfig_SetCredResolvers = new grpc.web.MethodDescriptor(
  '/kubeconfig.Kubeconfig/SetCredResolvers',
  grpc.web.MethodType.UNARY,
  proto.kubeconfig.CredResolversReq,
  protos_common_pb.CommonRes,
  /**
   * @param {!proto.kubeconfig.CredResolversReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  protos_common_pb.CommonRes.deserializeBinary
);


/**
 * @param {!proto.kubeconfig.CredResolversReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.kubeconfig.CommonRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.kubeconfig.CommonRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.kubeconfig.KubeconfigClient.prototype.setCredResolvers =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/SetCredResolvers',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_SetCredResolvers,
      callback);
};


/**
 * @param {!proto.kubeconfig.CredResolversReq} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.kubeconfig.CommonRes>}
 *     Promise that resolves to the response
 */
proto.kubeconfig.KubeconfigPromiseClient.prototype.setCredResolvers =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/SetCredResolvers',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_SetCredResolvers);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.kubeconfig.DeleteCredResolverReq,
 *   !proto.kubeconfig.CommonRes>}
 */
const methodDescriptor_Kubeconfig_DeleteCredResolver = new grpc.web.MethodDescriptor(
  '/kubeconfig.Kubeconfig/DeleteCredResolver',
  grpc.web.MethodType.UNARY,
  proto.kubeconfig.DeleteCredResolverReq,
  protos_common_pb.CommonRes,
  /**
   * @param {!proto.kubeconfig.DeleteCredResolverReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  protos_common_pb.CommonRes.deserializeBinary
);


/**
 * @param {!proto.kubeconfig.DeleteCredResolverReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.kubeconfig.CommonRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.kubeconfig.CommonRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.kubeconfig.KubeconfigClient.prototype.deleteCredResolver =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/DeleteCredResolver',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_DeleteCredResolver,
      callback);
};


/**
 * @param {!proto.kubeconfig.DeleteCredResolverReq} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.kubeconfig.CommonRes>}
 *     Promise that resolves to the response
 */
proto.kubeconfig.KubeconfigPromiseClient.prototype.deleteCredResolver =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/DeleteCredResolver',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_DeleteCredResolver);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.kubeconfig.CommonReq,
 *   !proto.kubeconfig.KubeConfigRes>}
 */
const methodDescriptor_Kubeconfig_GetKubeConfig = new grpc.web.MethodDescriptor(
  '/kubeconfig.Kubeconfig/GetKubeConfig',
  grpc.web.MethodType.UNARY,
  protos_common_pb.CommonReq,
  proto.kubeconfig.KubeConfigRes,
  /**
   * @param {!proto.kubeconfig.CommonReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.kubeconfig.KubeConfigRes.deserializeBinary
);


/**
 * @param {!proto.kubeconfig.CommonReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.kubeconfig.KubeConfigRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.kubeconfig.KubeConfigRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.kubeconfig.KubeconfigClient.prototype.getKubeConfig =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/GetKubeConfig',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_GetKubeConfig,
      callback);
};


/**
 * @param {!proto.kubeconfig.CommonReq} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.kubeconfig.KubeConfigRes>}
 *     Promise that resolves to the response
 */
proto.kubeconfig.KubeconfigPromiseClient.prototype.getKubeConfig =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/GetKubeConfig',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_GetKubeConfig);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.kubeconfig.KubeConfigReq,
 *   !proto.kubeconfig.CommonRes>}
 */
const methodDescriptor_Kubeconfig_SetKubeConfig = new grpc.web.MethodDescriptor(
  '/kubeconfig.Kubeconfig/SetKubeConfig',
  grpc.web.MethodType.UNARY,
  proto.kubeconfig.KubeConfigReq,
  protos_common_pb.CommonRes,
  /**
   * @param {!proto.kubeconfig.KubeConfigReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  protos_common_pb.CommonRes.deserializeBinary
);


/**
 * @param {!proto.kubeconfig.KubeConfigReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.kubeconfig.CommonRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.kubeconfig.CommonRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.kubeconfig.KubeconfigClient.prototype.setKubeConfig =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/SetKubeConfig',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_SetKubeConfig,
      callback);
};


/**
 * @param {!proto.kubeconfig.KubeConfigReq} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.kubeconfig.CommonRes>}
 *     Promise that resolves to the response
 */
proto.kubeconfig.KubeconfigPromiseClient.prototype.setKubeConfig =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/SetKubeConfig',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_SetKubeConfig);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.kubeconfig.CommonReq,
 *   !proto.kubeconfig.GetAvailableClustersRes>}
 */
const methodDescriptor_Kubeconfig_GetAvailableClusters = new grpc.web.MethodDescriptor(
  '/kubeconfig.Kubeconfig/GetAvailableClusters',
  grpc.web.MethodType.UNARY,
  protos_common_pb.CommonReq,
  proto.kubeconfig.GetAvailableClustersRes,
  /**
   * @param {!proto.kubeconfig.CommonReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.kubeconfig.GetAvailableClustersRes.deserializeBinary
);


/**
 * @param {!proto.kubeconfig.CommonReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.kubeconfig.GetAvailableClustersRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.kubeconfig.GetAvailableClustersRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.kubeconfig.KubeconfigClient.prototype.getAvailableClusters =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/GetAvailableClusters',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_GetAvailableClusters,
      callback);
};


/**
 * @param {!proto.kubeconfig.CommonReq} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.kubeconfig.GetAvailableClustersRes>}
 *     Promise that resolves to the response
 */
proto.kubeconfig.KubeconfigPromiseClient.prototype.getAvailableClusters =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/GetAvailableClusters',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_GetAvailableClusters);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.kubeconfig.RegisterClusterReq,
 *   !proto.kubeconfig.CommonRes>}
 */
const methodDescriptor_Kubeconfig_RegisterCluster = new grpc.web.MethodDescriptor(
  '/kubeconfig.Kubeconfig/RegisterCluster',
  grpc.web.MethodType.UNARY,
  proto.kubeconfig.RegisterClusterReq,
  protos_common_pb.CommonRes,
  /**
   * @param {!proto.kubeconfig.RegisterClusterReq} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  protos_common_pb.CommonRes.deserializeBinary
);


/**
 * @param {!proto.kubeconfig.RegisterClusterReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.kubeconfig.CommonRes)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.kubeconfig.CommonRes>|undefined}
 *     The XHR Node Readable Stream
 */
proto.kubeconfig.KubeconfigClient.prototype.registerCluster =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/RegisterCluster',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_RegisterCluster,
      callback);
};


/**
 * @param {!proto.kubeconfig.RegisterClusterReq} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.kubeconfig.CommonRes>}
 *     Promise that resolves to the response
 */
proto.kubeconfig.KubeconfigPromiseClient.prototype.registerCluster =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/kubeconfig.Kubeconfig/RegisterCluster',
      request,
      metadata || {},
      methodDescriptor_Kubeconfig_RegisterCluster);
};


module.exports = proto.kubeconfig;

