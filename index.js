const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.prefix = 'mc!';

// Connect to database
mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('Connected to database!'))
    .catch((err) => console.error(err));

// Command handling
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

// Event handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(process.env.TOKEN);
