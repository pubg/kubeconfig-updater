// required by tsyringe
import 'reflect-metadata'

import { ThemeProvider } from '@mui/material'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'
import { createTheme } from '@mui/material/styles'
import { container } from 'tsyringe'
import App from './App'
import { KubeconfigClient } from './protos/Kubeconfig_serviceServiceClientPb'
import logger from '../logger/logger'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

initializeIcons()

// TODO: initialize grpc kubeconfigclient
// TODO: make this customizable

declare global {
  interface Window {
    grpcWebPort?: number
  }
}

function getHostName() {
  logger.info(`Grpc Web Port in Browser ${window.grpcWebPort}`)
  return `http://localhost:${window.grpcWebPort ?? 10981}`
}

const client = new KubeconfigClient(getHostName())
container.register(KubeconfigClient, { useValue: client })

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
)
