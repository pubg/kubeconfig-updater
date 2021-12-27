import pino from 'pino'

const browserLogger = pino({
  name: 'renderer',
  // TODO: make this configurable based on dev/prod
  level: 'debug',
  browser: {},
})

export default browserLogger
