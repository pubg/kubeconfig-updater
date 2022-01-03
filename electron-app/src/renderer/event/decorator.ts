/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
import { reaction } from 'mobx'
import EventStore from './eventStore'
import { IDisposable } from '../types/disposable'

type Prototype = any
const DisposerSymbol = Symbol('array contains event listen disposer methods')

function registerDisposables(target: any, disposer: Disposer) {
  const cbs: Disposer[] = target[DisposerSymbol] ?? []
  target[DisposerSymbol] = cbs

  cbs.push(disposer)
}

type EventListener<EventArgs> = (e: EventArgs) => void

type EventListenerPropertyDescriptor<EventArgs> = TypedPropertyDescriptor<EventListener<EventArgs>>
type Disposer = {
  propertyKey: string
  disposer: ReturnType<typeof reaction>
}

export function listen<T>(eventStore: EventStore<T>) {
  return function (target: Prototype, propertyKey: string, descriptor: EventListenerPropertyDescriptor<T>) {
    const disposer = reaction(
      () => eventStore._value,
      (arg) => {
        if (arg) {
          descriptor.value?.(arg)
        }
      }
    )

    registerDisposables(target, { propertyKey, disposer })
  }
}

export function listener<T extends { new (...args: any[]): IDisposable }>(Base: T) {
  return class extends Base {
    dispose() {
      this.disposeListeners()
      super.dispose()
    }

    disposeListeners() {
      const disposers: Disposer[] = (this as any)[DisposerSymbol]

      for (const { disposer } of disposers) {
        disposer()
      }
    }
  }
}
