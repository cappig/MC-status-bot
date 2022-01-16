const Server = require('../database/ServerSchema');
const logger = require('../modules/nodeLogger.js')
const { createCache } = require('../modules/cache.js');

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        logger.info(`Joined new guild: ${guild.name}`);

        const server = new Server({
            _id: guild.id
        })
        server.save()
            .then(() => {
                logger.info('Added the server db entry.');
                createCache('Server', guild.id) 
            })
            .catch((err) => logger.error(err))
    }
}