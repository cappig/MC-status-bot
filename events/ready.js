const pinger = require('../modules/pinger.js')
const guildscan = require('../modules/guildscan.js')

module.exports = {
    name: 'ready',
    async execute(client) {
        console.log('\x1b[32m\x1b[1m%s\x1b[0m', 'The bot is up and running!');
        client.user.setActivity('for mc!help', {
            type: "WATCHING"
        });

        // Scan for guilds not in db
        if (process.argv.slice(2) == "--guildscan") {
            console.log('Started guild scan.');
            await guildscan.execute(client);
        }

        setInterval(() => {
            pinger.execute(client)
        }, 300000);
    }
}