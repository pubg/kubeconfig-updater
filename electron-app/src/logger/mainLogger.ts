import pino from 'pino'

const mainLogger = pino({
  name: 'main',
  // TODO: make this configurable based on dev/prod
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    // https://github.com/pinojs/pino-pretty#options
    options: {
      colorize: true,
      timestamp: false,
      ignore: 'pid,hostname',
    },
  },
})

export default mainLogger
