/* eslint-disable import/prefer-default-export */

import { autorun, IAutorunOptions, IReactionOptions, IReactionPublic, reaction } from 'mobx'
import { DependencyList, useEffect } from 'react'

/**
 * react hook version of mobx autorun. disposes callback when component is disposed.
 * read mobx autorun for more details
 * @param deps dependencies when callback should be re-evaluated
 */
export function useAutorun(view: (r: IReactionPublic) => unknown, opts?: IAutorunOptions, deps?: DependencyList): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => autorun(view, opts), deps ?? [])
}

/**
 * react hook version of mobx reaction. disposes callback when component is disposed.
 * read mobx reaction for more details
 * @param deps dependencies when callback should be re-evaluated
 */
export function useReaction<T, FireImmediately extends boolean = false>(
  expression: (r: IReactionPublic) => T,
  effect: (arg: T, prev: FireImmediately extends true ? T | undefined : T, r: IReactionPublic) => void,
  opts?: IReactionOptions<T, FireImmediately>,
  deps?: DependencyList
): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reaction(expression, effect, opts), deps ?? [])
}
