import { createTheme, Paper, ThemeProvider } from '@mui/material'
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { container } from 'tsyringe'
import { useState } from 'react'
import { SnackbarProvider } from 'notistack'
import Sidebar from './components/sidebar'
import ClusterManagement from './pages/clusterManagement/page'
import About from './pages/about/about'
import RegisterProgressSnackbar from './components/registerProgressPopup'
import * as containerHooks from './hooks/container'
import Configuration from './pages/configuration/configuration'
import ThemeStore from './store/themeStore'
import { useAutorun } from './hooks/mobx'
import NotiSnackbar from './components/notiSnackbar'
import SnackbarStore from './store/snackbarStore'
import browserLogger from './logger/browserLogger'

export default function App() {
  const themeStore = container.resolve(ThemeStore)
  const [theme, setTheme] = useState(themeStore.getMuiTheme())
  useAutorun(() => {
    setTheme(themeStore.getMuiTheme())
  })

  browserLogger.debug('current theme: ', theme)

  const snackbarStore = containerHooks.useResolve(SnackbarStore)

  return (
    <ThemeProvider theme={createTheme()}>
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
  )
}
