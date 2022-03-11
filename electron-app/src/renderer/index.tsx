// required by tsyringe
import 'reflect-metadata'

import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'
import { container } from 'tsyringe'
import App from './App'
import { ApplicationClient, KubeconfigClient } from './protos/Kubeconfig_serviceServiceClientPb'
import browserLogger from './logger/browserLogger'

browserLogger.debug('browser debug mode enabled')

declare global {
  interface Window {
    grpcWebPort?: number
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

const kubeConfigClient = new KubeconfigClient(getHostName())
container.register(KubeconfigClient, { useValue: kubeConfigClient })

const applicationClient = new ApplicationClient(getHostName())
container.register(ApplicationClient, { useValue: applicationClient })

render(<App />, document.getElementById('root'))
