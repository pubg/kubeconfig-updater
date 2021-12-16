import ClusterInfoList from '../components/clusterInfoList'
import { useStore } from '../stores/clusterMetadataStore'

export default function ClusterInfoListContainer() {
  const store = useStore()

  return (
    <ClusterInfoList
      clusterInformations={store.items}
      onHeaderNameClicked={() => {}}
    />
  )
}
