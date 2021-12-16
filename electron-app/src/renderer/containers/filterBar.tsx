import { useState } from 'react'
import FilterBar from '../components/filterBar'
import { ClusterInformationStatus } from '../protos/kubeconfig_service_pb'
import { Filter, MetadataItem, useStore } from '../pages/clusterManagement/clusterMetadataStore'

function predicateBuilder(
  name: string,
  showRegistered: boolean,
  groupTags: string[]
): Filter {
  const filter = ({ data }: MetadataItem): boolean => {
    if (!data.metadata.clustername.includes(name)) {
      return false
    }

    if (
      !showRegistered ||
      (showRegistered && data.status === ClusterInformationStatus.REGISTERED_OK)
    ) {
      return false
    }

    // TODO: refactor this
    if (
      groupTags.length > 0 &&
      !groupTags.every((selectedTag) =>
        data.metadata.clustertagsMap.some(
          ([clsuterTag]) => selectedTag === clsuterTag
        )
      )
    ) {
      return false
    }

    return true
  }

  return filter
}

export default function FilterBarContainer() {
  const store = useStore()

  const nil = () => {} // TODO: replace this function

  // TODO: should I really use react hook?
  const [nameFilter, setNameFilter] = useState('')
  const [showRegisterToggle, setShowRegisterToggle] = useState(false)
  const [selectedGroupTags, setSelectedGroupTags] = useState(new Set<string>())

  // TODO: optimize this using react hook
  store.setFilter(
    predicateBuilder(nameFilter, showRegisterToggle, [...selectedGroupTags])
  )

  return (
    <FilterBar
      onNameFilterChanged={(e) => setNameFilter(e.target.value)}
      onShowRegisterToggled={(_, bool) => setShowRegisterToggle(bool)}
      groupTags={store.tags}
      onGroupTagsChanged={(e, checked) => {
        // TODO: refactor this
        const newSet = new Set(selectedGroupTags)
        const tag = e.target.value
        if (checked) {
          newSet.add(tag)
        } else {
          newSet.delete(tag)
        }

        setSelectedGroupTags(newSet)
      }}
      onReloadClick={nil}
    />
  )
}
