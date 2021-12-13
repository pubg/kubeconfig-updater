import { Vendor } from './vendor'

export interface ClusterInfo {
  clusterName: string
  account: string
  vendor: Vendor
  registered: boolean
}
