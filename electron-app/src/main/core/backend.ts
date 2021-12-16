import _ from 'lodash'
import { exec, ChildProcess } from 'child_process'
import { inject, injectable } from 'tsyringe'
import { CoreExecCmd, CoreExecCwd } from './symbols'
import path from "path";

/**
 * BackendManager manages lifetime of kubeconfig-updater go core program
 */
@injectable()
export default class BackendManager {
  private process: ChildProcess | null = null

  private status: 'running' | 'exited' = 'running'

  private readonly grpcPort: number

  private readonly grpbWebPort: number

  constructor(
    @inject(CoreExecCmd) private readonly cmd: string,
    @inject(CoreExecCwd) private readonly cwd: string
  ) {
    this.grpcPort = _.random(10000, 20000, false)
    this.grpbWebPort = _.random(10000, 20000, false)
  }

  start() {
    const cmd = `${this.cmd} server --port=${this.grpcPort} --web-port=${this.grpbWebPort}`
    const absoluteCwd = path.join(process.cwd(), this.cwd)
    console.log(`[BackendManager] CMD ${cmd}`)
    console.log(`[BackendManager] CWD ${absoluteCwd}`)
    this.process = exec(cmd, { cwd: absoluteCwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      }
      console.log(stdout)
      console.log(stderr)
    })

    this.process.on('error', (e) => {

    })
    this.process.on('exit', (e) => {
      if (this.status === "running") {
        this.start()
      }
    })
  }

  end() {
    this.status = "exited"
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }
}
