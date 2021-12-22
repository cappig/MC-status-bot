const pinger = require('../modules/pinger.js')
const cron = require('node-cron');
const guildscan = require('../modules/guildscan.js');
const { AutoPoster } = require('topgg-autoposter');
const { Worker, workerData } = require("worker_threads");

module.exports = {
    name: 'ready',
    execute(client) {
        console.log('\x1b[32m\x1b[1m%s\x1b[0m', 'The bot is up and running!');

        // Update activity every hour so that it doesn't expire
        client.user.setActivity('for mc!help', {type: "WATCHING" });
        setInterval(() => { 
            client.user.setActivity('for mc!help', { type: "WATCHING" });
        }, 3600000);

        // Scan for guilds not in the db, the ones that were added when the bot was offline
        if (process.argv.slice(2) == "--guildscan") {
            (async () => {
                console.log('Started guild scan.');
                await guildscan.execute(client);
            })();
        }

        // Make client global
        global.client = client;

        // Start the dashboard
        console.log('Starting the dashboard.');
        //require("../dashboard/dashboard.js");

        // Post stats to top.gg
        if (process.env.TOPGGAPI) {
            AutoPoster(process.env.TOPGGAPI, client)
                .on('posted', () => {
                    console.log('\x1b[2m%s\x1b[0m', '   ⤷ Posted stats to Top.gg!')
                })
        } else console.log('\x1b[2m%s\x1b[0m', "   ⤷ No topgg token was provided - stats won't be posted to top.gg!")

        // Call the pinger every 5 minutes
        cron.schedule('*/5 * * * *', () => {
           //pinger.execute(client);
        });          
    }
}