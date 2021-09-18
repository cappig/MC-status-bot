const pinger = require('../modules/pinger.js')
const guildscan = require('../modules/guildscan.js')

module.exports = {
    name: 'ready',
    async execute(client) {
        console.log('\x1b[32m\x1b[1m%s\x1b[0m', 'The bot is up and running!');

        // Update activity every hour so that it doesn't expire
        client.user.setActivity('for mc!help', {type: "WATCHING" });
        setInterval(() => { 
            client.user.setActivity('for mc!help', { type: "WATCHING" });
        }, 3600000);

        // Scan for guilds not in the db, the ones that were added when the bot was offline
        if (process.argv.slice(2) == "--guildscan") {
            console.log('Started guild scan.');
            await guildscan.execute(client);
        }

        // Call the pinger every 5 minutes
        setInterval(() => {
            pinger.execute(client)
        }, 300000);
    }
}