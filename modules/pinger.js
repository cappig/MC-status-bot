const util = require('minecraft-server-util')
const logger = require('./logger.js')
const channupd = require('./channupd.js')
const { geetallCache } = require('../modules/cache.js')

module.exports = {
  async execute(client) {
    const servers = await geetallCache('Server')

    for (const server of servers) {
      if (!server.IP) continue

      const ip = server.IP.split(':')[0]

      const portnum = parseInt(server.IP.split(':')[1])
      const port = portnum < 65536 && portnum > 0 ? portnum : undefined

      if (server.Bedrock == true) {
        var pinger = util.statusBedrock(ip.split(':')[0].toLowerCase(), port ? port : 19132)
      } else {
        var pinger = util.status(ip.split(':')[0].toLowerCase(), port ? port : 25565)
      }

      pinger
        .then((result) => {
          // Aternos servers stay online and display Offline in their MOTD when they are actually offline
          if (!result || (server.IP.includes('aternos.me') && result.version == '§4● Offline')) {
            // server is offline
            if (server.Logging == true) {
              logger.execute('', server)
            }
            channupd.execute(client, server, '')
          } else {
            // server is online
            if (server.Logging == true) {
              logger.execute(result, server)
            }
            channupd.execute(client, server, result)
          }
        })
        .catch((error) => {
          // server is offline
          if (server.Logging == true) {
            logger.execute('', server)
          }
          channupd.execute(client, server, '')
        })
    }
  }
}
