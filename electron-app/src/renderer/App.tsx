import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import icon from '../../assets/icon.svg'
import './App.css'

const Hello = () => {
  return (
    <div>
      <h1>Title</h1>
      <p>Hello world!</p>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  )
}
