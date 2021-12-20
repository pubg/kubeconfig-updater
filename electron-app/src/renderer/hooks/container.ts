/* eslint-disable import/prefer-default-export */
import { useState } from 'react'
import { DependencyContainer, InjectionToken, container as defaultContainer } from 'tsyringe'

export function useResolve<T>(token: InjectionToken<T>, c?: DependencyContainer): T {
  const container = c ?? defaultContainer

  const [instance] = useState(() => container.resolve(token))

  return instance
}
