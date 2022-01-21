const pinger = require('../modules/pinger.js')
var cron = require('node-cron')
const guildscan = require('../modules/guildscan.js')
const logger = require('../modules/nodeLogger.js')
const { AutoPoster } = require('topgg-autoposter')

module.exports = {
  name: 'ready',
  execute(client) {
    logger.success('The bot is up and running!')

    // Update activity every hour so that it doesn't expire
    client.user.setActivity('for mc!help', { type: 'WATCHING' })
    setInterval(() => {
      client.user.setActivity('for mc!help', { type: 'WATCHING' })
    }, 3600000)

    // Scan for guilds not in the db, the ones that were added when the bot was offline
    if (process.argv.slice(2) != '--noguildscan') {
      ;(async () => {
        logger.info('Started guild scan.')
        await guildscan.execute(client)
      })()
    }

    // Post stats to top.gg
    if (process.env.TOPGGAPI) {
      AutoPoster(process.env.TOPGGAPI, client).on('posted', () => {
        logger.info('Posted stats to Top.gg!')
      })
    } else logger.info("No topgg token was provided - stats won't be posted to top.gg!")

    // Call the pinger every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      try {
        pinger.execute(client)
      } catch (err) {
        logger.error('Error while updating channels: ' + err)
      } finally {
        logger.info('Done updating channels')
      }
    })
  }
}
