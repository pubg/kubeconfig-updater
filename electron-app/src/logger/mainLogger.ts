import pino from 'pino'

const devOptions: pino.LoggerOptions = {
  name: 'main',
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      timestamp: false,
      ignore: 'pid,hostname',
    },
  },
}

// TODO: add pino-pretty
const prodOptions: pino.LoggerOptions = {
  name: 'main',
  level: 'error',
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

// TODO: replace hotfix destination to electron-managed logger
const mainLogger = pino(isDevelopment ? devOptions : prodOptions, { write: () => {} })

export default mainLogger
