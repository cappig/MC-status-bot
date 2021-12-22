const { Client, Intents, Collection } = require('discord.js');
const { RateLimiter } = require('discord.js-rate-limiter');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const Log = require('./database/logSchema');
const Server = require('./database/ServerSchema');
const redis = require("redis");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.rateLimiter = new RateLimiter(1, 1000); // Rate limit to one message per second
client.commands = new Collection();
client.prefix = 'mc!';

console.log('\x1b[32m\x1b[1m%s\x1b[0m', 'Starting the bot!');

// Connect to database
mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('\x1b[2m%s\x1b[0m', '   ⤷ Connected to database!'))
    .catch((err) => console.error(err));

// Flush redis
const redisclient = redis.createClient();
redisclient.flushall('SYNC', async function (err, succeeded) {

    console.log('\x1b[2m%s\x1b[0m', `   ⤷ Flushing Redis -  ${err ? err : succeeded}`);

    // Cache the entire mongo database to redis. 
    // Cache it only after redis gets flushed
        console.log('\x1b[2m%s\x1b[0m', '   ⤷ Caching the database: ')

        await Log.find()
            .then((result) => {
                result.forEach(log => redisclient.hset('Log', log._id, JSON.stringify(log.logs)))
                console.log('\x1b[2m%s\x1b[0m', '      ⤷ Cached logs!')
            })
            .catch((err) => console.error(err));

        await Server.find()
            .then((result) => {
                result.forEach(server => {
                    var value = { ...server.toObject()};  // Copy server object
                    value._id = undefined; // Remove the _id from the value
                    redisclient.hset('Server', server._id, JSON.stringify(value))
                })
                console.log('\x1b[2m%s\x1b[0m', '      ⤷ Cached servers!')

                // Log the client in here to prevent the bot from starting before
                // the db has been completely cached.
                client.login(process.env.TOKEN);
            })
            .catch((err) => console.error(err));
});
// Make the redis client global
global.redisclient = redisclient;

require("./modules/dashapi.js")

// Command handling
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

// Event handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}