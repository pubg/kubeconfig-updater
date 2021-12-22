import pino from 'pino'
import 'pino-pretty'

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

const prodOptions: pino.LoggerOptions = {
  name: 'main',
  level: 'error',
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

const mainLogger = pino(isDevelopment ? devOptions : prodOptions)

export default mainLogger
