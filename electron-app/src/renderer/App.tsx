import { Paper, ThemeProvider } from '@mui/material'
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { container } from 'tsyringe'
import { SnackbarProvider } from 'notistack'
import { observer } from 'mobx-react-lite'
import Sidebar from './components/sidebar'
import ClusterManagement from './pages/clusterManagement/page'
import About from './pages/about/about'
import Configuration from './pages/configuration/configuration'
import ThemeStore from './store/themeStore'
import NotiSnackbar from './components/notiSnackbar'
import browserLogger from './logger/browserLogger'
import CredResolver from './pages/credResolver/page'

export default observer(function App() {
  const { muiTheme } = container.resolve(ThemeStore)

  browserLogger.debug('current theme: ', muiTheme)

  return (
    <ThemeProvider theme={muiTheme}>
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
              <Route path="/credentials-resolver" component={CredResolver} />
              <Route path="/configuration" component={Configuration} />
              <Route path="/about" component={About} />
            </Switch>
          </Paper>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  )
})
