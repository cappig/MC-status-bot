/* This script can be run if the bot was offline for a time.
 * It will check if the bot is in a guild that isnt in
 * the database. This happends if it the bot was invited 
 * while it was offline.
 */
const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');

module.exports = {
    async execute(client) {
        // Array of guild ids that the bot is in
        const guilds = client.guilds.cache.map(guild => guild.id);

        const docs = await Server.find();
        // Array of guild ids that are in the database
        const database = docs.map(docs => docs.id);

        let i = 0;
        for (const guild of guilds) {
            if (!database.includes(guild)) {
                i++;

                const server = new Server({
                    _id: guild
                });
                server.save()
                    .catch((err) => console.error(err))
            }
        }

        console.log('\x1b[1m%s\x1b[0m', `Ended guild scan. Added ${i} new guilds to the database`);
    }
}