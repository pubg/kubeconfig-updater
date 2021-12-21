import pino from 'pino'

const mainLogger = pino({
  name: 'main',
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
