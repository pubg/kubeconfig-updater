import { Box, styled } from '@mui/material'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
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
  const value = useMemo(() => configToResolverKey(item), [item])

  browserLogger.debug('value: ', value)

  // TODO: inspect this error
  // why value is not changed?
  // 1. reference has changed when passing updateConfig()
  const onChange = (newValue: string) => {
    browserLogger.debug(`old value: ${value}, new value: ${newValue}`)
    const newKind = getKind(newValue)
    const profile = newKind === CredentialResolverKind.PROFILE ? newValue : undefined
    updateConfig(item, newKind, profile)

    browserLogger.debug('updated item: ', toJS(item))
  }

  return (
    <CredentialSelectionListItemContainer>
      <CredentialsSelection accountId={accountid} value={value} options={options} onChange={onChange} />
    </CredentialSelectionListItemContainer>
  )
})
