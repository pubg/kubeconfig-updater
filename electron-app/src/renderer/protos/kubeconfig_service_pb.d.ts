import * as jspb from 'google-protobuf'

import * as protos_common_pb from '../protos/common_pb';


export class CredResolverConfig extends jspb.Message {
  getAccountid(): string;
  setAccountid(value: string): CredResolverConfig;

  getInfravendor(): string;
  setInfravendor(value: string): CredResolverConfig;

  getAccountalias(): string;
  setAccountalias(value: string): CredResolverConfig;

  getKind(): CredentialResolverKind;
  setKind(value: CredentialResolverKind): CredResolverConfig;

  getResolverattributesMap(): jspb.Map<string, string>;
  clearResolverattributesMap(): CredResolverConfig;

  getStatus(): CredentialResolverStatus;
  setStatus(value: CredentialResolverStatus): CredResolverConfig;

  getStatusdetail(): string;
  setStatusdetail(value: string): CredResolverConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CredResolverConfig.AsObject;
  static toObject(includeInstance: boolean, msg: CredResolverConfig): CredResolverConfig.AsObject;
  static serializeBinaryToWriter(message: CredResolverConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CredResolverConfig;
  static deserializeBinaryFromReader(message: CredResolverConfig, reader: jspb.BinaryReader): CredResolverConfig;
}

export namespace CredResolverConfig {
  export type AsObject = {
    accountid: string,
    infravendor: string,
    accountalias: string,
    kind: CredentialResolverKind,
    resolverattributesMap: Array<[string, string]>,
    status: CredentialResolverStatus,
    statusdetail: string,
  }
}

export class CredResolversReq extends jspb.Message {
  getConfigsList(): Array<CredResolverConfig>;
  setConfigsList(value: Array<CredResolverConfig>): CredResolversReq;
  clearConfigsList(): CredResolversReq;
  addConfigs(value?: CredResolverConfig, index?: number): CredResolverConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CredResolversReq.AsObject;
  static toObject(includeInstance: boolean, msg: CredResolversReq): CredResolversReq.AsObject;
  static serializeBinaryToWriter(message: CredResolversReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CredResolversReq;
  static deserializeBinaryFromReader(message: CredResolversReq, reader: jspb.BinaryReader): CredResolversReq;
}

export namespace CredResolversReq {
  export type AsObject = {
    configsList: Array<CredResolverConfig.AsObject>,
  }
}

export class GetCredResolversRes extends jspb.Message {
  getCommonres(): protos_common_pb.CommonRes | undefined;
  setCommonres(value?: protos_common_pb.CommonRes): GetCredResolversRes;
  hasCommonres(): boolean;
  clearCommonres(): GetCredResolversRes;

  getConfigsList(): Array<CredResolverConfig>;
  setConfigsList(value: Array<CredResolverConfig>): GetCredResolversRes;
  clearConfigsList(): GetCredResolversRes;
  addConfigs(value?: CredResolverConfig, index?: number): CredResolverConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCredResolversRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetCredResolversRes): GetCredResolversRes.AsObject;
  static serializeBinaryToWriter(message: GetCredResolversRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCredResolversRes;
  static deserializeBinaryFromReader(message: GetCredResolversRes, reader: jspb.BinaryReader): GetCredResolversRes;
}

export namespace GetCredResolversRes {
  export type AsObject = {
    commonres?: protos_common_pb.CommonRes.AsObject,
    configsList: Array<CredResolverConfig.AsObject>,
  }
}

export class DeleteCredResolverReq extends jspb.Message {
  getAccountid(): string;
  setAccountid(value: string): DeleteCredResolverReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteCredResolverReq.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteCredResolverReq): DeleteCredResolverReq.AsObject;
  static serializeBinaryToWriter(message: DeleteCredResolverReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteCredResolverReq;
  static deserializeBinaryFromReader(message: DeleteCredResolverReq, reader: jspb.BinaryReader): DeleteCredResolverReq;
}

export namespace DeleteCredResolverReq {
  export type AsObject = {
    accountid: string,
  }
}

export class GetSupportedVendorsRes extends jspb.Message {
  getCommonres(): protos_common_pb.CommonRes | undefined;
  setCommonres(value?: protos_common_pb.CommonRes): GetSupportedVendorsRes;
  hasCommonres(): boolean;
  clearCommonres(): GetSupportedVendorsRes;

  getVendorsList(): Array<Vendor>;
  setVendorsList(value: Array<Vendor>): GetSupportedVendorsRes;
  clearVendorsList(): GetSupportedVendorsRes;
  addVendors(value?: Vendor, index?: number): Vendor;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSupportedVendorsRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetSupportedVendorsRes): GetSupportedVendorsRes.AsObject;
  static serializeBinaryToWriter(message: GetSupportedVendorsRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSupportedVendorsRes;
  static deserializeBinaryFromReader(message: GetSupportedVendorsRes, reader: jspb.BinaryReader): GetSupportedVendorsRes;
}

export namespace GetSupportedVendorsRes {
  export type AsObject = {
    commonres?: protos_common_pb.CommonRes.AsObject,
    vendorsList: Array<Vendor.AsObject>,
  }
}

export class Vendor extends jspb.Message {
  getVendorname(): string;
  setVendorname(value: string): Vendor;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vendor.AsObject;
  static toObject(includeInstance: boolean, msg: Vendor): Vendor.AsObject;
  static serializeBinaryToWriter(message: Vendor, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vendor;
  static deserializeBinaryFromReader(message: Vendor, reader: jspb.BinaryReader): Vendor;
}

export namespace Vendor {
  export type AsObject = {
    vendorname: string,
  }
}

export class GetRegisteredProfilesReq extends jspb.Message {
  getInfravendor(): string;
  setInfravendor(value: string): GetRegisteredProfilesReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRegisteredProfilesReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetRegisteredProfilesReq): GetRegisteredProfilesReq.AsObject;
  static serializeBinaryToWriter(message: GetRegisteredProfilesReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRegisteredProfilesReq;
  static deserializeBinaryFromReader(message: GetRegisteredProfilesReq, reader: jspb.BinaryReader): GetRegisteredProfilesReq;
}

export namespace GetRegisteredProfilesReq {
  export type AsObject = {
    infravendor: string,
  }
}

export class GetRegisteredProfilesRes extends jspb.Message {
  getCommonres(): protos_common_pb.CommonRes | undefined;
  setCommonres(value?: protos_common_pb.CommonRes): GetRegisteredProfilesRes;
  hasCommonres(): boolean;
  clearCommonres(): GetRegisteredProfilesRes;

  getProfilesList(): Array<Profile>;
  setProfilesList(value: Array<Profile>): GetRegisteredProfilesRes;
  clearProfilesList(): GetRegisteredProfilesRes;
  addProfiles(value?: Profile, index?: number): Profile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRegisteredProfilesRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetRegisteredProfilesRes): GetRegisteredProfilesRes.AsObject;
  static serializeBinaryToWriter(message: GetRegisteredProfilesRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRegisteredProfilesRes;
  static deserializeBinaryFromReader(message: GetRegisteredProfilesRes, reader: jspb.BinaryReader): GetRegisteredProfilesRes;
}

export namespace GetRegisteredProfilesRes {
  export type AsObject = {
    commonres?: protos_common_pb.CommonRes.AsObject,
    profilesList: Array<Profile.AsObject>,
  }
}

export class Profile extends jspb.Message {
  getProfilename(): string;
  setProfilename(value: string): Profile;

  getAccountid(): string;
  setAccountid(value: string): Profile;

  getInfravendor(): string;
  setInfravendor(value: string): Profile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Profile.AsObject;
  static toObject(includeInstance: boolean, msg: Profile): Profile.AsObject;
  static serializeBinaryToWriter(message: Profile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Profile;
  static deserializeBinaryFromReader(message: Profile, reader: jspb.BinaryReader): Profile;
}

export namespace Profile {
  export type AsObject = {
    profilename: string,
    accountid: string,
    infravendor: string,
  }
}

export class KubeConfigReq extends jspb.Message {
  getCommonreq(): protos_common_pb.CommonReq | undefined;
  setCommonreq(value?: protos_common_pb.CommonReq): KubeConfigReq;
  hasCommonreq(): boolean;
  clearCommonreq(): KubeConfigReq;

  getConfig(): string;
  setConfig(value: string): KubeConfigReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KubeConfigReq.AsObject;
  static toObject(includeInstance: boolean, msg: KubeConfigReq): KubeConfigReq.AsObject;
  static serializeBinaryToWriter(message: KubeConfigReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KubeConfigReq;
  static deserializeBinaryFromReader(message: KubeConfigReq, reader: jspb.BinaryReader): KubeConfigReq;
}

export namespace KubeConfigReq {
  export type AsObject = {
    commonreq?: protos_common_pb.CommonReq.AsObject,
    config: string,
  }
}

export class KubeConfigRes extends jspb.Message {
  getCommonres(): protos_common_pb.CommonRes | undefined;
  setCommonres(value?: protos_common_pb.CommonRes): KubeConfigRes;
  hasCommonres(): boolean;
  clearCommonres(): KubeConfigRes;

  getConfig(): string;
  setConfig(value: string): KubeConfigRes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KubeConfigRes.AsObject;
  static toObject(includeInstance: boolean, msg: KubeConfigRes): KubeConfigRes.AsObject;
  static serializeBinaryToWriter(message: KubeConfigRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KubeConfigRes;
  static deserializeBinaryFromReader(message: KubeConfigRes, reader: jspb.BinaryReader): KubeConfigRes;
}

export namespace KubeConfigRes {
  export type AsObject = {
    commonres?: protos_common_pb.CommonRes.AsObject,
    config: string,
  }
}

export class ClusterMetadata extends jspb.Message {
  getClustername(): string;
  setClustername(value: string): ClusterMetadata;

  getCredresolverid(): string;
  setCredresolverid(value: string): ClusterMetadata;

  getClustertagsMap(): jspb.Map<string, string>;
  clearClustertagsMap(): ClusterMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClusterMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: ClusterMetadata): ClusterMetadata.AsObject;
  static serializeBinaryToWriter(message: ClusterMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClusterMetadata;
  static deserializeBinaryFromReader(message: ClusterMetadata, reader: jspb.BinaryReader): ClusterMetadata;
}

export namespace ClusterMetadata {
  export type AsObject = {
    clustername: string,
    credresolverid: string,
    clustertagsMap: Array<[string, string]>,
  }
}

export class AggregatedClusterMetadata extends jspb.Message {
  getMetadata(): ClusterMetadata | undefined;
  setMetadata(value?: ClusterMetadata): AggregatedClusterMetadata;
  hasMetadata(): boolean;
  clearMetadata(): AggregatedClusterMetadata;

  getDataresolversList(): Array<string>;
  setDataresolversList(value: Array<string>): AggregatedClusterMetadata;
  clearDataresolversList(): AggregatedClusterMetadata;
  addDataresolvers(value: string, index?: number): AggregatedClusterMetadata;

  getStatus(): ClusterInformationStatus;
  setStatus(value: ClusterInformationStatus): AggregatedClusterMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AggregatedClusterMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: AggregatedClusterMetadata): AggregatedClusterMetadata.AsObject;
  static serializeBinaryToWriter(message: AggregatedClusterMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AggregatedClusterMetadata;
  static deserializeBinaryFromReader(message: AggregatedClusterMetadata, reader: jspb.BinaryReader): AggregatedClusterMetadata;
}

export namespace AggregatedClusterMetadata {
  export type AsObject = {
    metadata?: ClusterMetadata.AsObject,
    dataresolversList: Array<string>,
    status: ClusterInformationStatus,
  }
}

export class GetAvailableClustersRes extends jspb.Message {
  getCommonres(): protos_common_pb.CommonRes | undefined;
  setCommonres(value?: protos_common_pb.CommonRes): GetAvailableClustersRes;
  hasCommonres(): boolean;
  clearCommonres(): GetAvailableClustersRes;

  getClustersList(): Array<AggregatedClusterMetadata>;
  setClustersList(value: Array<AggregatedClusterMetadata>): GetAvailableClustersRes;
  clearClustersList(): GetAvailableClustersRes;
  addClusters(value?: AggregatedClusterMetadata, index?: number): AggregatedClusterMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAvailableClustersRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetAvailableClustersRes): GetAvailableClustersRes.AsObject;
  static serializeBinaryToWriter(message: GetAvailableClustersRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAvailableClustersRes;
  static deserializeBinaryFromReader(message: GetAvailableClustersRes, reader: jspb.BinaryReader): GetAvailableClustersRes;
}

export namespace GetAvailableClustersRes {
  export type AsObject = {
    commonres?: protos_common_pb.CommonRes.AsObject,
    clustersList: Array<AggregatedClusterMetadata.AsObject>,
  }
}

export class RegisterClusterReq extends jspb.Message {
  getCommonreq(): protos_common_pb.CommonReq | undefined;
  setCommonreq(value?: protos_common_pb.CommonReq): RegisterClusterReq;
  hasCommonreq(): boolean;
  clearCommonreq(): RegisterClusterReq;

  getClustername(): string;
  setClustername(value: string): RegisterClusterReq;

  getAccountid(): string;
  setAccountid(value: string): RegisterClusterReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterClusterReq.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterClusterReq): RegisterClusterReq.AsObject;
  static serializeBinaryToWriter(message: RegisterClusterReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterClusterReq;
  static deserializeBinaryFromReader(message: RegisterClusterReq, reader: jspb.BinaryReader): RegisterClusterReq;
}

export namespace RegisterClusterReq {
  export type AsObject = {
    commonreq?: protos_common_pb.CommonReq.AsObject,
    clustername: string,
    accountid: string,
  }
}

export class DeleteClusterReq extends jspb.Message {
  getCommonreq(): protos_common_pb.CommonReq | undefined;
  setCommonreq(value?: protos_common_pb.CommonReq): DeleteClusterReq;
  hasCommonreq(): boolean;
  clearCommonreq(): DeleteClusterReq;

  getClustername(): string;
  setClustername(value: string): DeleteClusterReq;

  getCascade(): boolean;
  setCascade(value: boolean): DeleteClusterReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteClusterReq.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteClusterReq): DeleteClusterReq.AsObject;
  static serializeBinaryToWriter(message: DeleteClusterReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteClusterReq;
  static deserializeBinaryFromReader(message: DeleteClusterReq, reader: jspb.BinaryReader): DeleteClusterReq;
}

export namespace DeleteClusterReq {
  export type AsObject = {
    commonreq?: protos_common_pb.CommonReq.AsObject,
    clustername: string,
    cascade: boolean,
  }
}

export enum CredentialResolverKind { 
  DEFAULT = 0,
  ENV = 1,
  IMDS = 2,
  PROFILE = 3,
}
export enum CredentialResolverStatus { 
  CRED_RESOLVER_UNKNOWN = 0,
  CRED_REGISTERED_OK = 1,
  CRED_REGISTERED_NOT_OK = 2,
  CRED_SUGGESTION_OK = 101,
}
export enum ClusterInformationStatus { 
  INFO_NOT_SETTED = 0,
  REGISTERED_OK = 1,
  REGISTERED_NOTOK_NO_CRED_RESOLVER = 2,
  REGISTERED_NOTOK_CRED_RES_NOTOK = 3,
  REGISTERED_UNKNOWN = 4,
  SUGGESTION_OK = 101,
  SUGGESTION_NOTOK_NO_CRED_RESOLVER = 102,
  SUGGESTION_NOTOK_CRED_RES_NOTOK = 103,
}
