const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');

module.exports = {
    name: 'guildDelete',
    execute(guild) {

        console.log('\x1b[1m%s\x1b[0m', `Left guild: ${guild.name}`);

        Server.findOneAndRemove({
                _id: guild.id
            }, {
                useFindAndModify: false
            })
            .then(() => console.log('\x1b[2m%s\x1b[0m', '   ⤷ Deleted the server db entry.'))
            .catch((err) => console.error(err))

        Log.findOneAndRemove({
                _id: guild.id
            }, {
                useFindAndModify: false
            })
            .then(() => console.log('\x1b[2m%s\x1b[0m', '   ⤷ Deleted the log db entry.'))
            .catch((err) => console.error(err))
    }
}