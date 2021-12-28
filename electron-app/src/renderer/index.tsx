// required by tsyringe
import 'reflect-metadata'

import { PaletteMode, ThemeProvider } from '@mui/material'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'
import { createTheme } from '@mui/material/styles'
import { container } from 'tsyringe'
import App from './App'
import { KubeconfigClient } from './protos/Kubeconfig_serviceServiceClientPb'
import browserLogger from './logger/browserLogger'
import { ThemeStore } from './components/themeStore'
import {autorun} from "mobx";

browserLogger.debug('browser debug mode enabled')

declare global {
  interface Window {
    grpcWebPort?: number
    theme?: string
    themeGetTheme?: () => string
    themeGetPreferredTheme?: () => string
  }
}

initializeIcons()

// TODO: initialize grpc kubeconfigclient
// TODO: make this customizable

function getHostName() {
  browserLogger.info(`Grpc Web Port in Browser ${window.grpcWebPort}, Default is 10981`)
  return `http://localhost:${window.grpcWebPort ?? 10981}`
}

const client = new KubeconfigClient(getHostName())
container.register(KubeconfigClient, { useValue: client })

render(
    <App />,
  document.getElementById('root')
)
