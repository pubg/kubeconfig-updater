import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { AggregatedClusterMetadata, ClusterInformationStatus, ClusterMetadata, MetadataResolverType } from '../../protos/kubeconfig_service_pb'
import { ClusterInfo, Status } from './clusterInfo'
import regions from './mockRegions.json'
import { Vendor } from './vendor'

interface MockRegion {
  fullName: string
  infraVendor: Vendor
}

export const mockRegions = [...(regions.AWS as MockRegion[]), ...(regions.Azure as MockRegion[]), ...(regions.Tencent as MockRegion[])]

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

function randDataResolversList() {
  const values = [MetadataResolverType.CRED_RESOLVER, MetadataResolverType.FOX, MetadataResolverType.KUBECONFIG, MetadataResolverType.META_RESOLVER_NOT_SETTED].filter(() => Math.random() > 0.5)

  if (values.length === 0) {
    values.push(MetadataResolverType.KUBECONFIG)
  }

  return values
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

function randMetadata(): ClusterMetadata.AsObject {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const region = _.sample(mockRegions)!

  return {
    clustername: `${randStage()}-${region.fullName}-${region.infraVendor}-${hash()}`,
    clustertagsMap: [
      ['vendor', region.infraVendor],
      ['account', account(region.infraVendor)],
    ],
    credresolverid: '',
  }
}

const status: Status[] = ['Registered', 'Unauthorized', 'Unknown', 'Unregistered']

export function generateMockClusterInfo(): AggregatedClusterMetadata.AsObject {
  return {
    dataresolversList: randDataResolversList(),
    status: _.sample(ClusterInformationStatus) as ClusterInformationStatus,
    metadata: randMetadata(),
  }
}

export function generateMockClusterInfos(len: number): AggregatedClusterMetadata.AsObject[] {
  const clusterInfos: AggregatedClusterMetadata.AsObject[] = []

  for (let i = 0; i < len; i += 1) {
    clusterInfos.push(generateMockClusterInfo())
  }

  return clusterInfos
}
