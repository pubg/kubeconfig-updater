import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { ClusterInfo, Status } from './clusterInfo'
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
  const template = '0123456789abcdef'
  const values: string[] = []
  for (let i = 0; i < 6; i += 1) {
    values.push(template[_.random(0, template.length)])
  }

  return values.join('')
}

function randAccount() {
  return _.random(10 ** 11, 10 ** 12).toString()
}

function randAccountUUID() {
  return uuidv4()
}

const accountTable = {
  AWS: [randAccount(), randAccount()],
  Tencent: [randAccount(), randAccount()],
  Google: [randAccount(), randAccount()],
  Azure: [randAccountUUID(), randAccountUUID()],
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

const status: Status[] = [
  'Registered',
  'Unauthorized',
  'Unknown',
  'Unregistered',
]

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      status: _.sample(status)!,
    })
  }

  return clusterInfos
}
