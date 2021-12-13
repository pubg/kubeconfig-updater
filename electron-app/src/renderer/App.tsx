import { Paper } from '@mui/material'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import Sidebar from './components/sidebar/sidebar'
import ClusterManagement from './pages/clusterManagement/clusterManagement'
import Home from './pages/home/home'

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
            width: '320px',
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
        </Switch>
      </Paper>
    </Router>
  )
}
