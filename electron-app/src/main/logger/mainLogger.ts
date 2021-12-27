import electronLogger from 'electron-log'

// const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

// TODO: replace hotfix destination to electron-managed logger
const mainLogger = electronLogger.create('main')

export default mainLogger
