import { Box, styled } from '@mui/material'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import CredentialsSelection from '../../components/credentialsSelection'
import { useResolve } from '../../hooks/container'
import browserLogger from '../../logger/browserLogger'
import { CredentialResolverKind } from '../../protos/kubeconfig_service_pb'
import { ObservedCredResolverConfig } from './type'
import UIStore from './UIStore'
import { configToResolverKey, getKind, updateConfig } from './utils'

const CredentialSelectionListItemContainer = styled(Box)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
  }
})

export interface CredentialSelectionListItemProps {
  item: ObservedCredResolverConfig
}

export default observer(function CredentialSelectionListItem({ item }: CredentialSelectionListItemProps) {
  const uiStore = useResolve(UIStore)

  // move this to other file?
  const { options } = uiStore

  const { accountid } = item
  // const value = configToResolverKey(item)
  const value = '[UNKNOWN]'

  // TODO: inspect this error
  // why value is not changed? -> because item is a new object when credResolverRepository fetch a new array
  // 1. reference has changed when passing updateConfig()
  const onChange = useCallback(
    (newValue: string) => {
      browserLogger.debug(`old value: ${value}, new value: ${newValue}`)

      // update UI config
      const newKind = getKind(newValue)
      const profile = newKind === CredentialResolverKind.PROFILE ? newValue : undefined
      updateConfig(item, newKind, profile)

      // request update to backend
      if (profile) {
        uiStore.credResolverStore.setCredResolver(item, profile)
      } else {
        uiStore.credResolverStore.setCredResolver(item)
      }
    },
    [item, uiStore.credResolverStore]
  )

  return (
    <CredentialSelectionListItemContainer>
      <CredentialsSelection accountId={accountid} value={value} options={options} onChange={onChange} />
    </CredentialSelectionListItemContainer>
  )
})
