import { Paper } from '@mui/material'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import { container } from 'tsyringe'
import './App.css'
import Sidebar from './components/sidebar'
import MockKubeconfigClient from './mock/grpc/grpcClient'
import ClusterManagement from './pages/clusterManagement/page'
import Home from './pages/home/home'
import { KubeconfigClient } from './protos/Kubeconfig_serviceServiceClientPb'
import About from './pages/about/about'

// TODO: delete this, only for testing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// container.register(KubeconfigClient, { useClass: MockKubeconfigClient as any })

export default function App() {
  return (
    <Router>
      <Paper
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
          elevation={3}
          sx={{
            display: 'flex',
            width: '280px',
            height: '100%',
            flexShrink: 0,
            flexGrow: 0,
          }}
        >
          <Sidebar />
        </Paper>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cluster-management" component={ClusterManagement} />
          <Route path="/about" component={About} />
        </Switch>
      </Paper>
    </Router>
  )
}
