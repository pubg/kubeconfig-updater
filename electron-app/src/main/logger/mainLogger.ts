import pino from 'pino'
import electronLogger from 'electron-log'

const devOptions: pino.LoggerOptions = {
  name: 'main',
  level: 'trace',

  // deprecated but still working
  prettyPrint: {
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: true,
  },
}

// TODO: add pino-pretty
const prodOptions: pino.LoggerOptions = {
  ...devOptions,
  name: 'main',
  level: 'info',
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

// TODO: replace hotfix destination to electron-managed logger
const mainLogger = pino(isDevelopment ? devOptions : prodOptions, { write: electronLogger.log })

export default mainLogger
