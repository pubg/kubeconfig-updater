import { Box, ListItem, styled } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import CredentialsSelection from '../../components/credentialsSelection'
import { useResolve } from '../../hooks/container'
import browserLogger from '../../logger/browserLogger'
import { CredentialResolverKind } from '../../protos/kubeconfig_service_pb'
import { ObservedCredResolverConfig } from './type'
import UIStore from './UIStore'
import { configToResolverKey, getKind, updateConfig } from './utils'

const CredentialSelectionListItemContainer = styled(ListItem)(({ theme }) => {
  return {}
})

export interface CredentialSelectionListItemProps {
  item: ObservedCredResolverConfig
}

export default observer(function CredentialSelectionListItem({ item }: CredentialSelectionListItemProps) {
  const uiStore = useResolve(UIStore)

  // move this to other file?
  const { options } = uiStore

  const { accountid } = item
  const value = configToResolverKey(item)

  // TODO: inspect this error
  // why value is not changed? -> because item is a new object when credResolverRepository fetch a new array
  // 1. reference has changed when passing updateConfig()
  const onChange = useCallback(
    (newValue: string) => {
      browserLogger.debug(`old value: ${value}, new value: ${newValue}`)

      // update UI config
      const newKind = getKind(newValue)
      const profile = newKind === CredentialResolverKind.PROFILE ? newValue : undefined

      // TODO: updateConfig() causes "all list item" to be re-rendered. try to avoid that
      // this is not necessary but I wanna achieve this.
      updateConfig(item, newKind, profile)

      // request update to backend
      uiStore.credResolverStore.setCredResolver(item)
    },
    [item, uiStore.credResolverStore, value]
  )

  return (
    <CredentialSelectionListItemContainer>
      <CredentialsSelection accountId={accountid} value={value} options={options} onChange={onChange} />
      <Box sx={{ width: '64px', border: '2px solid red' }} />
    </CredentialSelectionListItemContainer>
  )
})
