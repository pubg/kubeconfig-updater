import { Box, styled } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import CredentialsSelection from '../../components/credentialsSelection'
import { useResolve } from '../../hooks/container'
import { CredResolverConfig } from '../../protos/kubeconfig_service_pb'
import UIStore from './UIStore'
import { configToResolverKey } from './utils'

const CredentialSelectionListItemContainer = styled(Box)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
  }
})

export interface CredentialSelectionListItemProps {
  item: CredResolverConfig.AsObject
}

export default observer(function CredentialSelectionListItem({ item }: CredentialSelectionListItemProps) {
  const uiStore = useResolve(UIStore)

  // move this to other file?
  const { options } = uiStore

  const { accountid } = item
  const value = useMemo(() => configToResolverKey(item), [item])

  const onChange = (newValue: string) => {}

  return (
    <CredentialSelectionListItemContainer>
      <CredentialsSelection accountId={accountid} value={value} options={options} onChange={onChange} />
    </CredentialSelectionListItemContainer>
  )
})
