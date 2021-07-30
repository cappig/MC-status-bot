const Server = require('../database/ServerSchema');

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        console.log('\x1b[1m%s\x1b[0m', `Joined new guild: ${guild.name}`);

        const server = new Server({
            _id: guild.id
        });
        server.save()
            .then(() => console.log('\x1b[2m%s\x1b[0m', '   ⤷ Added the server db entry.'))
            .catch((err) => console.error(err))
    }
}