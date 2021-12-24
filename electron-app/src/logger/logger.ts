/* eslint-disable global-require */
import pino from 'pino'

function loggerFactory(): pino.Logger {
  if (process.env.BUILD_TYPE === 'main') {
    return require('./mainLogger')
  }

  return require('./browserLogger')
}

const logger = loggerFactory().default

export default logger
