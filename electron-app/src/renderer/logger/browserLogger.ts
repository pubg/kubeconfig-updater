declare namespace window {
  const electronLogger: typeof import('electron-log')['functions']
}

const { electronLogger: browserLogger } = window

export default browserLogger
