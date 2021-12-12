import crypto, { randomUUID } from 'crypto'
import _ from 'lodash'
import { ClusterInfo } from './clusterInfo'
import regions from './mockRegions.json'
import { Vendor } from './vendor'

interface MockRegion {
  fullName: string
  infraVendor: Vendor
}

export const mockRegions = [
  ...(regions.AWS as MockRegion[]),
  ...(regions.Azure as MockRegion[]),
  ...(regions.Tencent as MockRegion[]),
]

function randStage(): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return _.sample(['dev', 'staging', 'test', 'prod'])!
}

function hash() {
  return crypto.randomBytes(3).toString('hex')
}

const accountTable = {
  AWS: [
    crypto.randomInt(10 ** 11, 10 ** 12).toString(),
    crypto.randomInt(10 ** 11, 10 ** 12).toString(),
  ],
  Tencent: [
    crypto.randomInt(10 ** 11, 10 ** 12).toString(),
    crypto.randomInt(10 ** 11, 10 ** 12).toString(),
  ],
  Google: [
    crypto.randomInt(10 ** 11, 10 ** 12).toString(),
    crypto.randomInt(10 ** 11, 10 ** 12).toString(),
  ],
  Azure: [randomUUID(), randomUUID()],
}

function account(vendor: Vendor): string {
  switch (vendor) {
    case 'AWS':
    case 'Tencent':
    case 'Google':
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return _.sample(accountTable[vendor])!

    case 'Azure':
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return _.sample(accountTable.Azure)!

    default:
      throw new Error(`unexpected account vendor: ${vendor}`)
  }
}

export function generateMockClusterInfos(len: number): ClusterInfo[] {
  const clusterInfos: ClusterInfo[] = []

  for (let i = 0; i < len; i += 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const region = _.sample(mockRegions)!

    clusterInfos.push({
      clusterName: `${randStage()}-${region.fullName}-${
        region.infraVendor
      }-${hash()}`,
      vendor: region.infraVendor as Vendor,
      account: account(region.infraVendor),
    })
  }

  return clusterInfos
}
