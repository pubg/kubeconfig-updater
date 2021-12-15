import FilterBar from '../components/filterBar'

export default function FilterBarContainer() {
  const nil = () => {} // TODO: implement this
  return <FilterBar onNameFilterChanged={nil} onReloadClick={nil} onShowRegisterToggled={nil} groupTags={['a', 'b', 'c']} />
}
