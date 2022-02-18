import electronLogger from 'electron-log'

// const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

// TODO: replace hotfix destination to electron-managed logger
const mainLogger = electronLogger.create('main')

mainLogger.transports.console.useStyles = true
mainLogger.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
mainLogger.transports.file.maxSize = 1048576 * 128 // 128 mb

if (process.env.DEBUG_PROD !== 'true' && process.env.NODE_ENV === 'production') {
  mainLogger.transports.console.level = 'info'
  mainLogger.transports.file.level = 'info'
}

// move past logs to main.old.log and clear the current log file.
const mainLogFilePath = mainLogger.transports.file.getFile().path
mainLogger.transports.file.archiveLog(mainLogFilePath)
mainLogger.transports.file.getFile().clear()

export default mainLogger
