/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import { createAtom, observable, makeAutoObservable } from 'mobx'
import { Atom } from 'mobx/dist/internal'
import { injectable } from 'tsyringe'
import { OBSERVED } from '../../types/mobx'
import browserLogger from '../logger/browserLogger'

type KeySelector<T> = (object: T) => string

interface IValueWithPayload<T, P> {
  value: T
  payload: P | null
}

export type ValueWithPayload<T, P> = OBSERVED<IValueWithPayload<T, P>>
export type MoveFunc<T> = (dest: T, src: T) => void

/**
 * PayloadMap manages T object with payload
 */
@injectable()
export class PayloadMap<T, Payload = any> {
  private readonly atom: Atom

  private _map: Map<string, ValueWithPayload<T, Payload>> = observable.map()

  values(): IterableIterator<ValueWithPayload<T, Payload>> {
    this.atom.reportObserved()

    return this._map.values()
  }

  constructor(private readonly keySelector: KeySelector<T>, private readonly moveFunc?: MoveFunc<T>) {
    this.atom = createAtom('PayloadStore')
  }

  add(value: T): void {
    const key = this.keySelector(value)
    const observedValue: ValueWithPayload<T, Payload> = makeAutoObservable({
      value,
      payload: null,
    }) as ValueWithPayload<T, Payload>

    this._map.set(key, observedValue)

    this.atom.reportChanged()
  }

  /**
   * update store to match array.
   * performs in-place add, update, delete.
   */
  update(newValues: T[]): void {
    const oldValues = [...this.values()]

    const added = newValues.filter((object) => !this._map.has(this.keySelector(object)))
    const updated = _.intersectionWith(newValues, oldValues, (newVal, oldVal) => {
      return this.keySelector(newVal) === this.keySelector(oldVal.value)
    })
    const deleted = _.differenceWith(oldValues, newValues, (oldVal, newVal) => {
      return this.keySelector(newVal) === this.keySelector(oldVal.value)
    })

    for (const val of added) {
      this.add(val)
    }

    for (const val of updated) {
      const key = this.keySelector(val)
      const oldVal = this._map.get(key)

      if (oldVal) {
        if (this.moveFunc) {
          this.moveFunc(oldVal.value, val)
        } else {
          oldVal.value = val
        }
      } else {
        browserLogger.error(new Error(`key ${key} is not found.`))
      }
    }

    for (const val of deleted) {
      this.delete(val.value)
    }

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

  get size() {
    return this._map.size
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]()
  }
}
