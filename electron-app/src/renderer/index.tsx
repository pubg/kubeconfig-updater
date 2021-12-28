// required by tsyringe
import 'reflect-metadata'

import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'
import { container } from 'tsyringe'
import App from './App'
import { KubeconfigClient } from './protos/Kubeconfig_serviceServiceClientPb'
import browserLogger from './logger/browserLogger'
import { ThemeStorageType, ThemeStore } from './components/themeStore'

browserLogger.debug('browser debug mode enabled')

declare global {
  interface Window {
    grpcWebPort?: number
    theme?: string
    themeGetTheme?: () => string
    themeGetPreferredTheme?: () => string
    themeSetPreferredTheme?: (preferredTheme: string) => void
    managedFromElectron?: boolean
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

const themeStorageType: ThemeStorageType = window.managedFromElectron === undefined ? 'browser' : 'electron'
container.register(ThemeStore, { useValue: new ThemeStore(themeStorageType) })

render(<App />, document.getElementById('root'))
