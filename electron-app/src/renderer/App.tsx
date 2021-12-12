import { Paper } from '@mui/material'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import Sidebar from './components/sidebar/sidebar'
import ClusterManagement from './pages/clusterManagement/clusterManagement'
import Home from './pages/home/home'

export default function App() {
  return (
    <Router>
      <Paper sx={{ height: '100vh', display: 'flex', flexDirection: 'row' }}>
        <Paper
          elevation={3}
          sx={{ display: 'flex', width: '280px', height: '100%' }}
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
