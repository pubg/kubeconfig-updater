import _ from 'lodash'
import { exec, ChildProcess } from 'child_process'
import { inject, injectable } from 'tsyringe'
import os from 'os'
import { dialog } from 'electron'
import { CoreExecCmd, CoreExecCwd } from './symbols'

/**
 * BackendManager manages lifetime of kubeconfig-updater go core program
 */
@injectable()
export default class BackendManager {
  private process: ChildProcess | null = null

  private status: 'running' | 'exited' = 'running'

  private readonly grpcPort: number

  private readonly grpbWebPort: number

  private errorCount: number = 0

  constructor(
    @inject(CoreExecCmd) private readonly cmd: string,
    @inject(CoreExecCwd) private readonly cwd: string
  ) {
    this.grpcPort = _.random(10000, 20000, false)
    this.grpbWebPort = _.random(10000, 20000, false)
  }

  start() {
    const cmd = `${this.cmd} server --port=${this.grpcPort} --web-port=${this.grpbWebPort}`
    console.log(`[BackendManager] CMD ${cmd}`)
    console.log(`[BackendManager] CWD ${this.cwd}`)
    this.process = exec(cmd, { cwd: this.cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      }
      console.log(stdout)
      console.log(stderr)
    })

    this.process.stdout?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        console.log(`[BackendManager] StdOut: ${line}`)
      })
    })

    this.process.stderr?.on('data', (data: string) => {
      data.split('\n').forEach((line) => {
        console.log(`[BackendManager] StdErr: ${line}`)
      })
    })

    this.process.on('error', (e) => {})
    this.process.on('exit', async (e) => {
      if (this.status === 'running') {
        this.errorCount += 1
        if (this.errorCount >= 10) {
          console.log(
            await dialog.showMessageBox({
              message: 'Cannot Connect to Logic Controller Process',
            })
          )
          process.exit(1)
        }
        console.log('kubeconfig-updater-backend died, try restart')
        this.start()
      }
    })
  }

  end() {
    this.status = 'exited'
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }
}
