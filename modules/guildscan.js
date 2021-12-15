/* This script can be run if the bot was offline for a time.
 * It will check if the bot is in a guild that isn't in
 * the database. This happens if it the bot was invited 
 * while it was offline.
 */
const Server = require('../database/ServerSchema');
const { geetallCache } = require('../modules/cache.js');
require('../modules/cache.js')
module.exports = {
    async execute(client) {
        // Array of guild ids that the bot is in
        const guilds = client.guilds.cache.map(guild => guild.id);

        const docs = await geetallCache('Server');
        // Array of guild ids that are in the database
        const database = docs.map(docs => docs._id);

        let a = 0;
        let l = 0;
        for (const guild of guilds) {
            if (!database.includes(guild)) {
                a++;
                await Server.create({ _id: guild });
                Server.findOne({ _id: guild }).cache()
                    .catch((err) => console.error(err));;
                console.log(`guildscan added: ${guild}`);
            }
        }

        for (const entry of database) {
            if (!guilds.includes(entry)) {
                l++;

                Server.findOneAndRemove({
                        _id: entry
                    }, {
                        useFindAndModify: false
                    }).cache()
                    .catch((err) => console.error(err));
                console.log(`guildscan removed: ${entry}`)
            }
        }

        console.log('\x1b[1m%s\x1b[0m', `Ended guild scan. Added ${a} new guilds, and removed ${l} old guilds from the database`);
    }
}
