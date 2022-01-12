/* eslint-disable import/prefer-default-export */
import { CommonRes, ResultCode } from '../protos/common_pb'

export function createErrorResponse(e: unknown) {
  const res = new CommonRes()

  res.setStatus(ResultCode.UNKNOWN)
  res.setMessage(String(e))

  return res
}
