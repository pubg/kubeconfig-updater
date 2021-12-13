import * as jspb from 'google-protobuf'



export class CommonReq extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonReq.AsObject;
  static toObject(includeInstance: boolean, msg: CommonReq): CommonReq.AsObject;
  static serializeBinaryToWriter(message: CommonReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonReq;
  static deserializeBinaryFromReader(message: CommonReq, reader: jspb.BinaryReader): CommonReq;
}

export namespace CommonReq {
  export type AsObject = {
  }
}

export class CommonRes extends jspb.Message {
  getStatus(): ResultCode;
  setStatus(value: ResultCode): CommonRes;

  getMessage(): string;
  setMessage(value: string): CommonRes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonRes.AsObject;
  static toObject(includeInstance: boolean, msg: CommonRes): CommonRes.AsObject;
  static serializeBinaryToWriter(message: CommonRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonRes;
  static deserializeBinaryFromReader(message: CommonRes, reader: jspb.BinaryReader): CommonRes;
}

export namespace CommonRes {
  export type AsObject = {
    status: ResultCode,
    message: string,
  }
}

export enum ResultCode { 
  SUCCESS = 0,
  FAILED = 10001,
  UNKNOWN = 10002,
  INVALID_ARGUMENT = 10003,
  INVALID_PASSWORD = 10004,
  UNAUTHORIZED = 10005,
  INVALID_ACCOUNT = 10006,
  UNAVAILABLE = 10007,
  INTERNAL = 10008,
  CANCELED = 10009,
  NOT_FOUND = 10010,
  AUTH_TOKEN_EXPIRED = 10011,
  ALREADY_LINKED_PLATFORM_ID = 10012,
  NO_PERMISSION_ACCOUNT = 10013,
  RESTRICTED_LOGIN = 10014,
  BANNED = 10015,
  UNAUTHORIZED_EMAIL = 10016,
  DELETED_ACCOUNT = 10017,
  SERVER_BUSY = 10018,
  SERVER_SERVICE_OFF = 10019,
  SERVER_NOT_RESPONSE = 100002,
  SERVER_UNKNOWN = 100003,
  SERVER_ABORT = 100004,
  SERVER_NOT_FOUND = 100005,
  SERVER_INVALID_ARGUMENT = 100006,
  SERVER_OPERATION_FAILED = 100007,
  SERVER_ALREADY_EXISTS = 100008,
  SERVER_UNAUTHORIZED = 100009,
  SERVER_NO_PERMISSION = 100010,
  SERVER_INTERNAL = 100011,
  SERVER_DB_UPDATE_FAILED = 100012,
  SERVER_INVALID_GAME_SESSION = 100013,
}
