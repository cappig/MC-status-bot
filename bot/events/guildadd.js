const Server = require('../database/ServerSchema');
const { createCache } = require('../modules/cache.js');

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        console.log('\x1b[1m%s\x1b[0m', `Joined new guild: ${guild.name}`);

        const server = new Server({
            _id: guild.id
        })
        server.save()
            .then(() => {
                console.log('\x1b[2m%s\x1b[0m', '   ⤷ Added the server db entry.');
                createCache('Server', guild.id) 
            })
            .catch((err) => console.error(err))
    }
}