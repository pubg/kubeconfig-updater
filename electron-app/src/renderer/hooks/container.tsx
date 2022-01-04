/* eslint-disable import/prefer-default-export */
import React, { useContext, useEffect, useMemo } from 'react'
import { DependencyContainer, InjectionToken, container as defaultContainer } from 'tsyringe'
import browserLogger from '../logger/browserLogger'

export const ContainerContext = React.createContext<DependencyContainer | null>(null)

export function useResolve<T>(token: InjectionToken<T>, c?: DependencyContainer): T {
  const contextContainer = useContext(ContainerContext)
  const container = c ?? contextContainer ?? defaultContainer

  const instance = useMemo(() => container.resolve(token), [container, token])

  return instance
}

interface ContainerContextProviderProps {
  containerValue?: DependencyContainer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any
}

export const ContainerContextProvider = ({ children, containerValue }: ContainerContextProviderProps) => {
  const childContainer = useMemo(() => {
    return (containerValue ?? defaultContainer).createChildContainer()
  }, [containerValue])

  useEffect(() => {
    return () => childContainer.clearInstances()
  }, [childContainer])

  return <ContainerContext.Provider value={childContainer}>{children}</ContainerContext.Provider>
}

ContainerContextProvider.defaultProps = {
  containerValue: defaultContainer,
}
