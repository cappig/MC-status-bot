const Log = require('../database/logSchema');
require('../modules/cache.js');

module.exports = {
    async execute(result, server) {
        // Check if server has more than 288 logs
        // TODO: Make this get its info from cache
        const cursor = await Log.aggregate([{
            $match: {
                _id: server.id
            }
        }, {
            $project: {
                logs: {
                    $size: '$logs'
                }
            }
        }]);
        cursor.forEach(size => {
            if (size.logs == 289) {
                Log.findByIdAndUpdate({
                    _id: server.id
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
        });

        // Log the status
        if (result) {
            if (result.players.list.length != 0) {
                dbdata = {
                    $push: {
                        logs: {
                            online: true,
                            playersOnline: result.players.online,
                            playerNamesOnline: result.players.list.toString()
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
                _id: server.id
            }, dbdata, {
                useFindAndModify: false,
                new: true
            }).cache()
            .catch((err) => console.error(err))
    }
}