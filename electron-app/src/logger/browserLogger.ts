import pino from 'pino'

const browserLogger = pino({
  name: 'renderer',
  browser: {},
})

export default browserLogger
