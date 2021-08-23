const { PingMC } = require("pingmc");
const logger = require('./logger.js');
const channupd = require('./channupd.js');
const Server = require('../database/ServerSchema');

module.exports = {
    async execute(client) {
        Server.find({}, (err, servers) => {
            if (err) {
                console.error(err);
                return;
            }

            for (const server of servers) {
                if (!server.IP) continue;

                new PingMC(server.IP)
                    .ping()
                    .then((result) => {

                        if (result) {
                            // server is online
                            if (server.Logging == true) {
                                logger.execute(result, server);
                            }
                            channupd.execute(client, server, result);
                        } else {
                            // server is offline
                            if (server.Logging == true) {
                                logger.execute('', server);
                            }
                            channupd.execute(client, server, '');
                        };
                    })
                    .catch((error) => {
                        // server is offline
                        if (server.Logging == true) {
                            logger.execute('', server);
                        }
                        channupd.execute(client, server, '');

                        // Console log other errors
                        if (!(error.code == "ENOTFOUND" || error.code == "ECONNREFUSED" || error.code == "EHOSTUNREACH" || error.message == "Timed out")) console.error(error);
                        return;
                    })
            }
        })
    }
}