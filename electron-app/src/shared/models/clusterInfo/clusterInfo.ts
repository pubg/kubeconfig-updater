import { Vendor } from './vendor'

export type Status = 'Unregistered' | 'Registered' | 'Unknown' | 'Unauthorized'

export interface ClusterInfo {
  clusterName: string
  account: string
  vendor: Vendor
  status: Status
}
