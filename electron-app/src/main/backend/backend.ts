import _ from 'lodash'
import { exec, ChildProcess } from 'child_process'
import { inject, injectable, singleton } from 'tsyringe'
import { dialog } from 'electron'
import kill from 'tree-kill'
import 'util'
import * as util from 'util'
import { CoreExecCmd, CoreExecCwd } from './symbols'
import sleep from '../../renderer/utils/sleep'

/**
 * BackendManager manages lifetime of kubeconfig-updater go core program
 */
@singleton()
export default class BackendManager {

  private process: ChildProcess | null = null

  private _status: 'running' | 'exited' = 'running'

  private readonly _grpcPort: number

  private readonly _grpbWebPort: number

  private errorCount: number = 0

  get status(): "running" | "exited" {
    return this._status;
  }

  get grpcPort(): number {
    return this._grpcPort
  }

  get grpbWebPort(): number {
    return this._grpbWebPort
  }

  constructor(@inject(CoreExecCmd) private readonly cmd: string, @inject(CoreExecCwd) private readonly cwd: string) {
    this._grpcPort = _.random(10000, 20000, false)
    this._grpbWebPort = _.random(10000, 20000, false)
  }

  start() {
    const cmd = `${this.cmd} server --port=${this._grpcPort} --web-port=${this._grpbWebPort}`
    console.log(`[BackendManager] CMD ${cmd}`)
    console.log(`[BackendManager] CWD ${this.cwd}`)
    this.process = exec(cmd, { cwd: this.cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      }
    })

    this.process.stdout?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        if (line.trim() !== '') {
          console.log(`[BackendManager] StdOut: ${line}`)
        }
      })
    })

    this.process.stderr?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        if (line.trim() !== '') {
          console.log(`[BackendManager] StdErr: ${line}`)
        }
      })
    })

    this.process.on('error', (e) => {})
    this.process.on('exit', async (e) => {
      console.log(`[BackendManager] recerived childprocess exit event, status:${this._status}`)
      if (this._status === 'running') {
        this.errorCount += 1
        if (this.errorCount >= 10) {
          console.log(
            await dialog.showMessageBox({
              message: 'Cannot Connect to Logic Controller Process',
            })
          )
          process.exit(1)
        }
        console.log('[BackendManager] kubeconfig-updater-backend died, try restart')
        this.start()
      }
    })
  }

  async end() {
    console.log('[BackendManager] change backendmanager status to exited')
    this._status = 'exited'
    if (this.process) {
      console.log(`[BackendManager] tree kill backend process pid:${this.process.pid}`)
      const killPromise = (pid: number) => {
        return new Promise((resolve) => {
          kill(pid, (error) => {
            resolve(error)
          })
        })
      }
      const error = await killPromise(Number(this.process.pid))
      if (error) {
        console.log(`[BackendManager] tree kill process occurred error ${error}`)
      }
      console.log('[BackendManager] kill process finished')
      this.process = null
    }
  }
}
