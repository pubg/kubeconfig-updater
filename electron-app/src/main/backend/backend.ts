/* eslint-disable no-console */
import _ from 'lodash'
import { exec, ChildProcess } from 'child_process'
import { inject, injectable, singleton } from 'tsyringe'
import { dialog } from 'electron'
import kill from 'tree-kill'
import 'util'
import { BackendExecCmd, BackendExecCwd, BackendGrpcPort, BackendGrpcWebPort } from './symbols'
import logger from '../../logger/logger'

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

  get status(): 'running' | 'exited' {
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
    logger.info(`[BackendManager] CMD ${cmd}`)
    logger.info(`[BackendManager] CWD ${this.cwd}`)
    this.process = exec(cmd, { cwd: this.cwd }, (err, stdout, stderr) => {
      if (err) {
        logger.error(err)
      }
    })

    this.process.stdout?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        if (line.trim() !== '') {
          logger.info(`[BackendManager] StdOut: ${line}`)
        }
      })
    })

    this.process.stderr?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        if (line.trim() !== '') {
          logger.error(`[BackendManager] StdErr: ${line}`)
        }
      })
    })

    this.process.on('error', (e) => {})
    this.process.on('exit', async (e) => {
      logger.info(`[BackendManager] recerived childprocess exit event, status:${this._status}`)
      if (this._status === 'running') {
        this.errorCount += 1
        if (this.errorCount >= 10) {
          logger.error(
            await dialog.showMessageBox({
              message: 'Cannot Connect to Logic Controller Process',
            })
          )
          process.exit(1)
        }
        logger.warn('[BackendManager] kubeconfig-updater-backend died, try restart')
        this.start()
      }
    })
  }

  async end() {
    logger.info('[BackendManager] change backendmanager status to exited')
    this._status = 'exited'
    if (this.process) {
      logger.info(`[BackendManager] tree kill backend process pid:${this.process.pid}`)
      const killPromise = (pid: number) => {
        return new Promise((resolve) => {
          kill(pid, (error) => {
            resolve(error)
          })
        })
      }
      const error = await killPromise(Number(this.process.pid))
      if (error) {
        logger.error(`[BackendManager] tree kill process occurred error ${error}`)
      }
      logger.info('[BackendManager] kill process finished')
      this.process = null
    }
  }
}
