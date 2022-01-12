/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import _ from 'lodash'
import { ChildProcess, exec, ExecException, execFile, ExecFileException } from 'child_process'
import { inject, singleton } from 'tsyringe'
import { dialog } from 'electron'
import kill from 'tree-kill'
import { BackendExecCmd, BackendExecCwd, BackendGrpcPort, BackendGrpcWebPort } from './symbols'
import mainLogger from '../logger/mainLogger'

/**
 * BackendManager manages lifetime of kubeconfig-updater go core program
 */
@singleton()
export default class BackendManager {
  private readonly backendLogger = mainLogger.scope('BackendManager')

  private process: ChildProcess | null = null

  private _status: 'running' | 'on-exit' | 'exited' = 'running'

  private readonly _grpcPort: number

  private readonly _grpcWebPort: number

  private errorCount: number = 0

  get status() {
    return this._status
  }

  get grpcPort(): number {
    return this._grpcPort
  }

  get grpbWebPort(): number {
    return this._grpcWebPort
  }

  constructor(
    @inject(BackendExecCmd) private readonly cmd: string,
    @inject(BackendExecCwd) private readonly cwd: string,
    @inject(BackendGrpcPort) grpcPort: number,
    @inject(BackendGrpcWebPort) grpcWebPort: number
  ) {
    this._grpcPort = grpcPort || _.random(10000, 20000, false)
    this._grpcWebPort = grpcWebPort || _.random(10000, 20000, false)
  }

  start() {
    const command = `${this.cmd} server --port=${this._grpcPort} --web-port=${this._grpcWebPort}`
    this.backendLogger.info(`CommandLine: ${command}`)
    this.backendLogger.info(`WorkingDir: ${this.cwd}`)
    this.process = this.exec(command)

    this.process.stdout?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        if (line.trim() !== '') {
          this.backendLogger.info(`StdOut: ${line}`)
        }
      })
    })

    this.process.stderr?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        if (line.trim() !== '') {
          this.backendLogger.error(`StdErr: ${line}`)
        }
      })
    })

    this.process.on('error', (e) => {})
    this.process.on('exit', async (e) => {
      this.backendLogger.info(`recerived childprocess exit event, status:${this._status}`)
      if (this._status === 'running') {
        this.errorCount += 1
        if (this.errorCount >= 10) {
          this.backendLogger.error(
            await dialog.showMessageBox({
              message: 'Cannot Connect to Logic Controller Process',
            })
          )
          process.exit(1)
        }
        this.backendLogger.warn('kubeconfig-updater-backend died, try restart')
        this.start()
      }
    })
  }

  async end() {
    this.backendLogger.info('change backendmanager status to exited')
    this._status = 'on-exit'

    const currProcess = this.process

    if (currProcess) {
      this.backendLogger.info(`tree kill backend process pid:${currProcess.pid}`)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const err = await new Promise((resolve) => kill(currProcess.pid!, resolve))

      if (err) {
        this.backendLogger.error(`tree kill process occurred error ${err}`)
      }
      this.backendLogger.info('kill process finished')
      this.process = null
    }

    this._status = 'exited'
  }

  private exec(command: string) {
    const errHandler = (err: ExecFileException | ExecException | null) => {
      // if backend tree-killed, it returns exit code 1 which is expected and normal.
      if (err && this.status !== 'on-exit') {
        this.backendLogger.error(err)
      }
    }

    if (process.platform === 'win32') {
      const cmd = command.split(' ')[0]
      const args = command.split(' ').slice(1)
      return execFile(cmd, args, { cwd: this.cwd }, errHandler)
    }

    return exec(command, { cwd: this.cwd }, errHandler)
  }
}
