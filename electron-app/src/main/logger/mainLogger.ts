import electronLogger from 'electron-log'

// const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

// TODO: replace hotfix destination to electron-managed logger
const mainLogger = electronLogger.create('main')

mainLogger.transports.console.useStyles = true
mainLogger.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'

if (process.env.DEBUG_PROD !== 'true' && process.env.NODE_ENV === 'production') {
  mainLogger.transports.console.level = 'info'
  mainLogger.transports.file.level = 'info'
}

export default mainLogger
