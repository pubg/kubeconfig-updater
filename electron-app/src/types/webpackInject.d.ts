// all global variables injected by webpack
// NOTE: this variables won't be appeared in main process when dev mode.
// because webpack envolved for main/ only when production mode.
declare global {
  namespace WebpackInjected {
    const BUILD_VERSION: string
  }
}

export {}
