import { Paper } from '@mui/material'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import Sidebar from './components/sidebar'
import ClusterManagement from './pages/clusterManagement/page'
import Home from './pages/home/home'
import About from './pages/about/about'
import RegisterProgressSnackbar from './components/registerProgressPopup'
import * as containerHooks from './hooks/container'
import { ClusterMetadataRequester, ClusterMetadataRequesterContext } from './components/clusterMetadataRequester'
import { ClusterRegisterRequester, ClusterRegisterRequesterContext } from './components/clusterRegisterRequester'
import { ClusterMetadataStore, ClusterMetadataStoreContext } from './pages/clusterManagement/clusterMetadataStore'
import Configuration from "./pages/configuration/configuration";

export default function App() {
  const clusterMetadataStore = containerHooks.useResolve(ClusterMetadataStore)
  const clusterRegisterRequester = containerHooks.useResolve(ClusterRegisterRequester)
  const clusterMetadataRequester = containerHooks.useResolve(ClusterMetadataRequester)

  return (
    <ClusterMetadataRequesterContext.Provider value={clusterMetadataRequester}>
      <ClusterRegisterRequesterContext.Provider value={clusterRegisterRequester}>
        <ClusterMetadataStoreContext.Provider value={clusterMetadataStore}>
          <Router>
            <Paper
              square
              sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'stretch',
                alignItems: 'stretch',
              }}
            >
              <Paper
                square
                elevation={18}
                sx={{
                  display: 'flex',
                  height: '100%',
                  flexShrink: 0,
                  flexGrow: 0,
                }}
              >
                <Sidebar />
              </Paper>
              <Switch>
                <Route exact path="/" component={About}/>
                <Route path="/cluster-management" component={ClusterManagement} />
                <Route path="/configuration" component={Configuration} />
                <Route path="/about" component={About} />
              </Switch>
              <RegisterProgressSnackbar />
            </Paper>
          </Router>
        </ClusterMetadataStoreContext.Provider>
      </ClusterRegisterRequesterContext.Provider>
    </ClusterMetadataRequesterContext.Provider>
  )
}
