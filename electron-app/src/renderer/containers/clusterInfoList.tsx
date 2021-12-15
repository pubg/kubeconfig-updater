import ClusterInfoList from '../components/clusterInfoList'

export default function ClusterInfoListContainer() {
  const nil = () => {}
  return <ClusterInfoList clusterInformations={[]} onHeaderNameClicked={nil} />
}
