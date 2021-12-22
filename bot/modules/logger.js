const Log = require('../database/logSchema');
const { lookup } = require('../modules/cache.js');

module.exports = {
    async execute(result, server) {
        // Check if server has more than 288 logs
        const logs = await lookup('Log', server._id) 

        if (logs.length >= 289) {
            Log.findByIdAndUpdate({
                _id: server._id
            }, {
                $pop: {
                    "logs": -1
                }
            }, {
                useFindAndModify: false,
                new: true
            }).cache()
            .catch((err) => console.error(err))
        }

        // Log the status
        if (result) {
            if (result.players.sample && result.players.sample != null && result.players.sample.length > 0) {
                const playernames = result.players.sample.map( function(obj) {
                    return obj.name;
                });

                dbdata = {
                    $push: {
                        logs: {
                            online: true,
                            playersOnline: result.players.online,
                            playerNamesOnline: playernames.toString()
                        }
                    }
                }
            } else {
                dbdata = {
                    $push: {
                        logs: {
                            online: true,
                            playersOnline: result.players.online
                        }
                    }
                }
            }
        } else {
            dbdata = {
                $push: {
                    logs: {
                        online: false
                    }
                }
            }
        }
        Log.findByIdAndUpdate({
                _id: server._id
            }, dbdata, {
                useFindAndModify: false,
                new: true
            }).cache()
            .catch((err) => console.error(err))
    }
}