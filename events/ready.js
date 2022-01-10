const pinger = require('../modules/pinger.js')
var cron = require('node-cron');
const guildscan = require('../modules/guildscan.js');
const { AutoPoster } = require('topgg-autoposter');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
module.exports = {
    name: 'ready',
    execute(client) {
        console.log('\x1b[32m\x1b[1m%s\x1b[0m', 'The bot is up and running!');

        // Update activity every hour so that it doesn't expire
        client.user.setActivity('for mc!help | hosted by http://schost.us', { type: "WATCHING" });
        setInterval(() => {
            client.user.setActivity('for mc!help | hosted by http://schost.us', { type: "WATCHING" });
        }, 3600000);

        // Scan for guilds not in the db, the ones that were added when the bot was offline
        if (process.argv.slice(2) == "--guildscan") {
            (async() => {
                console.log('Started guild scan.');
                await guildscan.execute(client);
            })();
        }
        const commands = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(client.user.id), { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
        // Post stats to top.gg
        if (process.env.TOPGGAPI) {
            AutoPoster(process.env.TOPGGAPI, client)
                .on('posted', () => {
                    console.log('\x1b[2m%s\x1b[0m', '   ⤷ Posted stats to Top.gg!')
                })
        } else console.log('\x1b[2m%s\x1b[0m', "   ⤷ No topgg token was provided - stats won't be posted to top.gg!")

        // Call the pinger every 5 minutes
        cron.schedule('*/5 * * * *', () => {
            pinger.execute(client);
        });
        //pinger.execute(client);
        console.log("Ready!");
    }
}