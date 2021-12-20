/* eslint-disable import/prefer-default-export */
import { useState } from 'react'
import tsyringe, { DependencyContainer, InjectionToken } from 'tsyringe'

export function useResolve<T>(token: InjectionToken<T>, c?: DependencyContainer): T {
  const container = c ?? tsyringe.container

  const [instance] = useState(() => container.resolve(token))

  return instance
}
