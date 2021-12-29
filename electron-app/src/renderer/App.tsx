import { Paper, ThemeProvider } from '@mui/material'
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { container } from 'tsyringe'
import { useEffect, useState } from 'react'
import { SnackbarProvider } from 'notistack'
import dayjs from 'dayjs'
import Sidebar from './components/sidebar'
import ClusterManagement from './pages/clusterManagement/page'
import About from './pages/about/about'
import RegisterProgressSnackbar from './components/registerProgressPopup'
import * as containerHooks from './hooks/container'
import { ClusterMetadataRequester, ClusterMetadataRequesterContext } from './components/clusterMetadataRequester'
import { ClusterRegisterRequester, ClusterRegisterRequesterContext } from './components/clusterRegisterRequester'
import { ClusterMetadataStore, ClusterMetadataStoreContext } from './pages/clusterManagement/clusterMetadataStore'
import Configuration from './pages/configuration/configuration'
import { ThemeStore } from './components/themeStore'
import { useAutorun } from './hooks/mobx'
import NotiSnackbar from './components/notiSnackbar'
import SnackbarStore from './store/snackbarStore'

export default function App() {
  const themeStore = container.resolve(ThemeStore)
  const [theme, setTheme] = useState(themeStore.getMuiTheme())
  useAutorun(() => {
    setTheme(themeStore.getMuiTheme())
  })

  const clusterMetadataStore = containerHooks.useResolve(ClusterMetadataStore)
  const clusterRegisterRequester = containerHooks.useResolve(ClusterRegisterRequester)
  const clusterMetadataRequester = containerHooks.useResolve(ClusterMetadataRequester)

  const snackbarStore = containerHooks.useResolve(SnackbarStore)

  return (
    <ClusterMetadataRequesterContext.Provider value={clusterMetadataRequester}>
      <ClusterRegisterRequesterContext.Provider value={clusterRegisterRequester}>
        <ClusterMetadataStoreContext.Provider value={clusterMetadataStore}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={10} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
              <NotiSnackbar />
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
                    <Route exact path="/" component={ClusterManagement} />
                    <Route path="/cluster-management" component={ClusterManagement} />
                    <Route path="/configuration" component={Configuration} />
                    <Route path="/about" component={About} />
                  </Switch>
                  <RegisterProgressSnackbar />
                </Paper>
              </Router>
            </SnackbarProvider>
          </ThemeProvider>
        </ClusterMetadataStoreContext.Provider>
      </ClusterRegisterRequesterContext.Provider>
    </ClusterMetadataRequesterContext.Provider>
  )
}
