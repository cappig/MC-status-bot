const util = require('minecraft-server-util');
const logger = require('./logger.js');
const channupd = require('./channupd.js');
const { geetallCache } = require('../modules/cache.js');

module.exports = {
    async execute(client) {
        console.log("running pinger")
        const servers = await geetallCache('Server');

        for (const server of servers) {
            await sleep(1000);
            if (!server.IP || server.IP == "") continue;
            console.log("ping " + server.IP)


            const ip = server.IP.split(':')[0];
            try {
                const portnum = parseInt(server.IP.split(':')[1]);
                const port = portnum < 65536 || portnum > 0 ? portnum : NaN;
            } catch (er) {
                console.log(er)
                continue;
            }
            const portnum = Number(server.IP.split(':')[1]);
            const port = portnum < 65536 || portnum > 0 ? portnum : NaN;

            if (server.Bedrock == true) {
                var pinger = util.statusBedrock(ip, port ? port : 19132);
            } else {
                var pinger = util.status(ip, port ? port : 25565, {
                    timeout: 3000,
                });
            }

            pinger
                .then((result) => {
                    // Aternos servers stay online and display Offline in their MOTD when they are actually offline
                    if (!result || (server.IP.includes('aternos.me') && result.version == '§4● Offline')) {
                        // server is offline
                        if (server.Logging == true) {
                            logger.execute('', server);
                        }
                        channupd.execute(client, server, '');
                    } else {
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

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}