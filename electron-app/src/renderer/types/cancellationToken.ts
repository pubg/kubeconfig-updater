/* eslint-disable max-classes-per-file */

export class CancellationToken {
  get canceled(): boolean {
    return this.source.isCancelRequested
  }

  constructor(private readonly source: CancellationTokenSource) {}
}

export class CancellationTokenSource {
  public readonly token = new CancellationToken(this)

  private _cancelRequested = false

  get isCancelRequested() {
    return this._cancelRequested
  }

  cancel() {
    this._cancelRequested = true
  }
}
