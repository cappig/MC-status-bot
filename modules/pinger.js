const { PingMC } = require("pingmc");
const logger = require('./logger.js');
const channupd = require('./channupd.js');
const Server = require('../database/ServerSchema');

module.exports = {
    async execute(client) {
        Server.find({} , (err, servers) => {
            if (err) {
                console.error(err); 
                return;
            }

            for (const server of servers) {
                if (!server.IP) continue;

                new PingMC(server.IP)
                    .ping()
                    .then((result) => {
                        if (result.version) {
                            // server is online
                            logger.execute(result, server);
                            channupd.execute(client, server, result);
                        }
                        else {
                            // server is offline
                            logger.execute('', server);
                            channupd.execute(client, server, '');
                        };
                    })
                    .catch((error) => {
                        if (error.code == "ENOTFOUND" || error.code == "ECONNREFUSED" || error.message == "Timed out") {
                            // server is offline
                            logger.execute('', server);
                            channupd.execute(client, server, '');
                        }
                        else console.error(error); return;
                    })
            }
        })
    }
}