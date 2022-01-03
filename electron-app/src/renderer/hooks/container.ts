/* eslint-disable import/prefer-default-export */
import { useMemo } from 'react'
import { DependencyContainer, InjectionToken, container as defaultContainer } from 'tsyringe'

export function useResolve<T>(token: InjectionToken<T>, c?: DependencyContainer): T {
  const container = c ?? defaultContainer

  const instance = useMemo(() => container.resolve(token), [container, token])

  return instance
}
