import _ from 'lodash'
import { loremIpsum as lorem } from 'lorem-ipsum'

const vendors = ['AWS', 'Azure', 'Tencent'] as const

export function genAccountId() {
  return _.random(10 * 11, 10 ** 12).toString()
}

export function genVendor() {
  return _.sample(vendors)
}

export function genClusterName() {
  return lorem({ count: 5, paragraphLowerBound: 2, paragraphUpperBound: 4 })
}
