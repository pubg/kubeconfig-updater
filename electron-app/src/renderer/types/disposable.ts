/* eslint-disable class-methods-use-this */

export interface IDisposable {
  dispose(): void
}

export class Disposable implements IDisposable {
  dispose(): void {}
}
