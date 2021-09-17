const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const { AutoPoster } = require('topgg-autoposter');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
//const client = new Discord.Client({ intents: ["MESSAGE_CREATE", "TYPING_START", "CHANNEL_CREATE", "CHANNEL_UPDATE", "CHANNEL_DELETE"] });
client.commands = new Collection();
client.prefix = 'mc!';

// Connect to database
mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => console.log('Connected to database!'))
    .catch((err) => console.error(err));

// Post stats to top.gg
AutoPoster(process.env.TOPGGAPI, client)
  .on('posted', () => {
    console.log('Posted stats to Top.gg!')
  })

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

client.login(process.env.TOKEN);
