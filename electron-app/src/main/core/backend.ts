import { exec } from 'child_process'
import { inject, injectable } from 'tsyringe'
import { CoreExecPath } from './symbols'

/**
 * BackendManager manages lifetime of kubeconfig-updater go core program
 */
@injectable()
export default class BackendManager {

  constructor(@inject(CoreExecPath) private readonly execPath: string) {}
}
