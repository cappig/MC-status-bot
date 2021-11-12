const util = require('minecraft-server-util');
const logger = require('./logger.js');
const channupd = require('./channupd.js');
const { geetallCache } = require('../modules/cache.js');

module.exports = {
    async execute(client) {
        // TODO: Make this get its info from cache
        const servers = await geetallCache('Server');

        for (const server of servers) {
            if (!server.IP) continue;

            if (server.Bedrock == true) {
                const portnum = Number(args[0].split(':')[1]);
                var port =  portnum < 65536 || portnum > 0 ? NaN : portnum;

                var pinger = util.statusBedrock(server.IP.split(':')[0], { port: port ? port : 19132})
            } else {
                var pinger = util.status(server.IP.split(':')[0], { port: port ? port : 25565})
            }
    
            pinger
                .then((result) => {
                    //console.log(result)
                    // Aternos servers stay online and display Offline in their MOTD when they are actually offline
                    if (!result || (server.IP.includes('aternos.me') && result.version == '● Offline')) {
                        // server is offline
                        if (server.Logging == true) {
                            logger.execute('', server);
                        }
                        channupd.execute(client, server, '');
                    }
                    else {
                        // server is online
                        if (server.Logging == true) {
                            logger.execute(result, server);
                        }
                        channupd.execute(client, server, result);
                    }
                })
                .catch((error) => {
                    // server is offline
                    if (server.Logging == true) {
                        logger.execute('', server);
                    }
                    channupd.execute(client, server, '');
                })
        }
    }
}