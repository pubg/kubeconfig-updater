/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/prefer-default-export */
import { AnnotationsMap, CreateObservableOptions } from 'mobx'

declare type OBSERVED_OBJECT_TYPING = {
  /**
   * @description this property only exists in type, not in runtime.
   * @private this field must not be accessed in runtime.
   */
  readonly __INTERNAL_OBSERVABLE_CONVERTED_OBJECT__: unique symbol
}
declare type OBSERVED<T> = T & OBSERVED_OBJECT_TYPING
declare type ORIGINAL_TYPE_FROM_OBSERVED<T> = Exclude<T, OBSERVED_OBJECT_TYPING>

declare type NoInfer<T> = [T][T extends any ? 0 : never]

declare module 'mobx' {
  export function makeAutoObservable<T extends object, AdditionalKeys extends PropertyKey = never>(
    target: T,
    overrides?: AnnotationsMap<T, NoInfer<AdditionalKeys>>,
    options?: CreateObservableOptions
  ): OBSERVED<T>
}
