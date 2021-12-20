import browserLogger from "./browserLogger"
import mainLogger from "./mainLogger"

function runtimeType(): 'main' | 'browser' {
  if (typeof process === 'object') {
    return 'main'
  }

  return 'browser'
}

const logger = runtimeType() === 'main' ? mainLogger : browserLogger

export default logger
