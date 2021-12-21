import { DetailsList, IColumn, IDetailsListProps } from '@fluentui/react'
import { Selection } from '@fluentui/react/lib/DetailsList'
import { Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import logger from '../../../logger/logger'
import { ClusterMetadataItem, useStore } from './clusterMetadataStore'

/*
const columns: IColumn[] = [
  {
    key: 'clusterName',
    name: 'Cluster Name',
    fieldName: 'clusterName',
    minWidth: 0,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return <Typography variant="body1">{item.clusterName}</Typography>
    },
  },
  {
    key: 'vendor',
    name: 'Infra Vendor',
    fieldName: 'vendor',
    minWidth: 0,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return <Typography variant="body1">{item.vendor}</Typography>
    },
  },
  {
    key: 'account',
    name: 'Account',
    fieldName: 'account',
    minWidth: 256,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return <Typography variant="body1">{item.account}</Typography>
    },
  },
  {
    key: 'status',
    name: 'Status',
    minWidth: 0,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return (
        <Typography variant="body1" color={colorFormatForStatus(item.status)}>
          {item.status}
        </Typography>
      )
    },
  },
  {
    key: 'action',
    name: 'action',
    minWidth: 64,
    isResizable: true,
    onRender: (item: ClusterInfo) => {
      return (
        <IconButton
          color="primary"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            setMenuAnchor(e.currentTarget)
          }}
        >
          <MoreVertOutlined />
        </IconButton>
      )
    },
  },
]
*/

export default observer(function ClusterInfoList() {
  const store = useStore()

  // TODO: add dyanmic column add/delete
  const columns = useMemo<IColumn[]>(() => {
    const items: IColumn[] = [
      {
        key: 'clusterName',
        name: 'Cluster Name',
        minWidth: 0,
        isResizable: true,
        onRender: (item: ClusterMetadataItem) => {
          return <Typography>{item.data.metadata.clustername}</Typography>
        },
      },
    ]

    return items
  }, [])

  // TODO
  const onHeaderNameClicked: IDetailsListProps['onColumnHeaderClick'] = () => {}

  return (
    <>
      <DetailsList
        columns={columns}
        items={store.items}
        onColumnHeaderClick={onHeaderNameClicked}
        selection={store.selectionRef as Selection}
      />
      {/* <Menu></Menu> */}
    </>
  )
})
