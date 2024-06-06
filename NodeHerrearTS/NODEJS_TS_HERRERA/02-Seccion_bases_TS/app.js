const buildLogger = require('./plugins/logger.plugin')

const logger = buildLogger('app.js')

logger.log("hola mundo")
logger.error("Esto es un error")
