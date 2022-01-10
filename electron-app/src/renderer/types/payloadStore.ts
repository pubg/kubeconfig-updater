/* eslint-disable @typescript-eslint/no-explicit-any */
import { action, computed, createAtom, makeObservable, observable } from 'mobx'
import { Atom } from 'mobx/dist/internal'
import { injectable } from 'tsyringe'
import { OBSERVED } from '../../types/mobx'

type KeySelector<T> = (object: T) => string

interface IValueWithPayload<T, P> {
  value: T
  payload: P | null
}

export type ValueWithPayload<T, P> = OBSERVED<IValueWithPayload<T, P>>

/**
 * PayloadStore manages T object with payload
 */
@injectable()
export class PayloadStore<T, Payload = any> {
  private readonly atom: Atom

  private _map: Map<string, ValueWithPayload<T, Payload>> = observable.map()

  get values(): IterableIterator<ValueWithPayload<T, Payload>> {
    if (this.atom.reportObserved()) {
      return this._map.values()
    }

    return [].values()
  }

  constructor(private readonly keySelector: KeySelector<T>) {
    this.atom = createAtom('PayloadStore')
  }

  add(value: T): void {
    const key = this.keySelector(value)
    const observedValue: ValueWithPayload<T, Payload> = makeObservable({ value, payload: null }, undefined, {
      deep: false,
    }) as ValueWithPayload<T, Payload>

    this._map.set(key, observedValue)

    this.atom.reportChanged()
  }

  get(key: string): IValueWithPayload<T, Payload> | undefined {
    return this._map.get(key)
  }

  has(key: string): boolean {
    return !!this.get(key)
  }

  delete(value: T): boolean {
    const key = this.keySelector(value)
    const success = this._map.delete(key)

    this.atom.reportChanged()

    return success
  }

  clear(): void {
    this._map.clear()

    this.atom.reportChanged()
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]
  }
}
