const Server = require('../database/ServerSchema')
const Log = require('../database/logSchema')
const { removeCache } = require('../modules/cache.js')
const logger = require('../modules/nodeLogger.js')

module.exports = {
  name: 'guildDelete',
  execute(guild) {
    if (!guild.name) return

    logger.info(`Left guild: ${guild.name}`)

    Server.findOneAndRemove(
      {
        _id: guild.id
      },
      {
        useFindAndModify: false,
        new: true
      }
    )
      .cache()
      .then(() => {
        removeCache('Server', guild.id)
        logger.info('Deleted the server db entry.')
      })
      .catch((err) => logger.error(err))

    Log.findOneAndRemove(
      {
        _id: guild.id
      },
      {
        useFindAndModify: false,
        new: true
      }
    )
      .cache()
      .then(() => logger.info('Deleted the log db entry.'))
      .catch((err) => logger.error(err))
  }
}
