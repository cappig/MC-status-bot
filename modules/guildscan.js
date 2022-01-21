/* This script can be run if the bot was offline for a time.
 * It will check if the bot is in a guild that isn't in
 * the database. This happens if it the bot was invited
 * while it was offline.
 */
const Server = require('../database/ServerSchema')
const { geetallCache } = require('../modules/cache.js')
require('../modules/cache.js')
const logger = require('../modules/nodeLogger.js')

module.exports = {
  async execute(client) {
    // Array of guild ids that the bot is in
    const guilds = client.guilds.cache.map((guild) => guild.id)

    const docs = await geetallCache('Server')
    // Array of guild ids that are in the database
    const database = docs.map((docs) => docs._id)

    let a = 0
    let l = 0
    for (const guild of guilds) {
      if (!database.includes(guild)) {
        a++
        await Server.create({ _id: guild })
        Server.findOne({ _id: guild })
          .cache()
          .catch((err) => logger.error(err))
        logger.info(`guildscan added: ${guild}`)
      }
    }

    for (const entry of database) {
      if (!guilds.includes(entry)) {
        l++

        Server.findOneAndRemove(
          {
            _id: entry
          },
          {
            useFindAndModify: false
          }
        )
          .cache()
          .catch((err) => logger.error(err))
        logger.info(`guildscan removed: ${entry}`)
      }
    }

    logger.success(`Ended guild scan. Added ${a} new guilds, and removed ${l} old guilds from the database`)
  }
}
