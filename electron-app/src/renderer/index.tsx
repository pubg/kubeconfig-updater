// required by tsyringe
import 'reflect-metadata'

import { ThemeProvider } from '@mui/material'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'
import { createTheme } from '@mui/material/styles'
import { container } from 'tsyringe'
import App from './App'
import { KubeconfigClient } from './protos/Kubeconfig_serviceServiceClientPb'

const theme = createTheme({
  palette: {
    // mode: 'dark',
  },
})

initializeIcons()

// TODO: initialize grpc kubeconfigclient
// TODO: make this customizable
const client = new KubeconfigClient('localhost:9081')
container.register(KubeconfigClient, { useValue: client })

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
)
