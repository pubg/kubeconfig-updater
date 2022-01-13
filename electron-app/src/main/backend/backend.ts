/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import _ from 'lodash'
import { ChildProcess, exec, ExecException, execFile, ExecFileException, spawn } from 'child_process'
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
    this.process = this.exec(command)

    this.process.stdout?.on('data', (chunk: Buffer) => {
      this.backendLogger.info(chunk.toString())
    })

    this.process.stderr?.on('data', (chunk: Buffer) => {
      this.backendLogger.error(chunk.toString())
    })

    this.process.on('error', (err) => {
      // if backend tree-killed, it returns exit code 1 which is expected and normal.
      if (err && this.status !== 'on-exit') {
        this.backendLogger.error(err)
      }
    })
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
    const cmd = command.split(' ')[0]
    const args = command.split(' ').slice(1)

    this.backendLogger.info('command: ', command)
    this.backendLogger.info('cmd: ', cmd)
    this.backendLogger.info('args: ', args)

    // when darwin platform production, it's launched under launchd
    // that has default $PATH env and it doesn't have /usr/local/bin
    if (process.platform === 'darwin') {
      const paths = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin'
      const PATH = `${process.env.PATH}:${paths}`
      return spawn(cmd, args, {
        cwd: this.cwd,
        shell: true,
        env: {
          ...process.env,
          PATH,
        },
      })
    }

    return spawn(cmd, args, { cwd: this.cwd, shell: true })
  }
}
