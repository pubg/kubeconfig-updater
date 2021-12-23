// required by tsyringe
import 'reflect-metadata'

import { PaletteMode, ThemeProvider } from '@mui/material'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'
import { createTheme } from '@mui/material/styles'
import { container } from 'tsyringe'
import App from './App'
import { KubeconfigClient } from './protos/Kubeconfig_serviceServiceClientPb'
import logger from '../logger/logger'

declare global {
  interface Window {
    grpcWebPort?: number
    theme?: string
  }
}

function getMuiTheme(): PaletteMode {
  logger.info(`Init Theme: ${window.theme}, Default is light`)
  return (window.theme as PaletteMode) ?? 'light'
}

const theme = createTheme({
  palette: {
    mode: getMuiTheme(),
  },
})

initializeIcons()

// TODO: initialize grpc kubeconfigclient
// TODO: make this customizable

function getHostName() {
  logger.info(`Grpc Web Port in Browser ${window.grpcWebPort}, Default is 10981`)
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
