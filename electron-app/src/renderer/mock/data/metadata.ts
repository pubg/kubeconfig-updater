import _ from 'lodash'
import { regions, stages } from './regions'

const vendors = ['aws', 'azr', 'tc'] as const
const sampleNames = ['main', 'test', 'game', 'web', 'devops', 'infra', 'foobar', 'lorem', 'lodash', 'something']

export function genAccountId() {
  return _.random(10 * 11, 10 ** 12).toString()
}

export function genVendor() {
  return _.sample(vendors)
}

export function genClusterName() {
  const stage = _.sample(stages)
  const name = _.sample(sampleNames)
  const vendor = _.sample(vendors)
  const region = _.sample(regions)

  return `${stage}-${name}-${vendor}-${region}-01`
}
