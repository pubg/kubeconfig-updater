/* eslint-disable no-console */
import _ from 'lodash'
import { exec, ChildProcess } from 'child_process'
import { inject, injectable, singleton } from 'tsyringe'
import { dialog } from 'electron'
import kill from 'tree-kill'
import { BackendExecCmd, BackendExecCwd, BackendGrpcPort, BackendGrpcWebPort } from './symbols'
import mainLogger from '../logger/mainLogger'

/**
 * BackendManager manages lifetime of kubeconfig-updater go core program
 */
@singleton()
export default class BackendManager {
  private process: ChildProcess | null = null

  private _status: 'running' | 'on-exit' | 'exited' = 'running'

  private readonly _grpcPort: number

  private readonly _grpbWebPort: number

  private errorCount: number = 0

  get status() {
    return this._status
  }

  get grpcPort(): number {
    return this._grpcPort
  }

  get grpbWebPort(): number {
    return this._grpbWebPort
  }

  constructor(
    @inject(BackendExecCmd) private readonly cmd: string,
    @inject(BackendExecCwd) private readonly cwd: string,
    @inject(BackendGrpcPort) grpcPort: number,
    @inject(BackendGrpcWebPort) grpcWebPort: number
  ) {
    this._grpcPort = grpcPort || _.random(10000, 20000, false)
    this._grpbWebPort = grpcWebPort || _.random(10000, 20000, false)
  }

  start() {
    const cmd = `${this.cmd} server --port=${this._grpcPort} --web-port=${this._grpbWebPort}`
    mainLogger.info(`[BackendManager] CMD ${cmd}`)
    mainLogger.info(`[BackendManager] CWD ${this.cwd}`)
    this.process = exec(cmd, { cwd: this.cwd }, (err, stdout, stderr) => {
      // if backend tree-killed, it returns exit code 1 which is expected and normal.
      if (err && this.status !== 'on-exit') {
        mainLogger.error(err)
      }
    })

    this.process.stdout?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        if (line.trim() !== '') {
          mainLogger.info(`[BackendManager] StdOut: ${line}`)
        }
      })
    })

    this.process.stderr?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        if (line.trim() !== '') {
          mainLogger.error(`[BackendManager] StdErr: ${line}`)
        }
      })
    })

    this.process.on('error', (e) => {})
    this.process.on('exit', async (e) => {
      mainLogger.info(`[BackendManager] recerived childprocess exit event, status:${this._status}`)
      if (this._status === 'running') {
        this.errorCount += 1
        if (this.errorCount >= 10) {
          mainLogger.error(
            await dialog.showMessageBox({
              message: 'Cannot Connect to Logic Controller Process',
            })
          )
          process.exit(1)
        }
        mainLogger.warn('[BackendManager] kubeconfig-updater-backend died, try restart')
        this.start()
      }
    })
  }

  async end() {
    mainLogger.info('[BackendManager] change backendmanager status to exited')
    this._status = 'on-exit'

    const currProcess = this.process

    if (currProcess) {
      mainLogger.info(`[BackendManager] tree kill backend process pid:${currProcess.pid}`)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const err = await new Promise((resolve) => kill(currProcess.pid!, resolve))

      if (err) {
        mainLogger.error(`[BackendManager] tree kill process occurred error ${err}`)
      }
      mainLogger.info('[BackendManager] kill process finished')
      this.process = null
    }

    this._status = 'exited'
  }
}
