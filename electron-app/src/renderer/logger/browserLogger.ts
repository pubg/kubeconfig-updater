declare namespace window {
  const electronLogger: typeof import('electron-log')['functions'] | undefined
}

const { electronLogger } = window

// in the dev-mode browser, preload.js not kicked in so electronLogger is undefined
const browserLogger = electronLogger ?? console

export default browserLogger
