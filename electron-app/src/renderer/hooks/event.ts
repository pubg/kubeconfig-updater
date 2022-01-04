/* eslint-disable import/prefer-default-export */
import EventStore from '../event/eventStore'
import { useReaction } from './mobx'

type Opts = Parameters<typeof useReaction>[2]
type Deps = Parameters<typeof useReaction>[3]

/**
 * react hook version of mobx event.
 */
export function useListen<T>(event: EventStore<T>, cb: (e: T) => void, opts?: Opts, deps?: Deps) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useReaction(() => event._value!, cb, opts, deps)
}
