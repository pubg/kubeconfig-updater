/* eslint-disable import/prefer-default-export */
import { Metadata } from 'grpc-web'

// TODO: improve this
export function getDefaultMetadata(): Metadata {
  const expires = 10000 // millisecond

  return {
    deadline: new Date(Date.now() + expires).toString(),
  }
}
