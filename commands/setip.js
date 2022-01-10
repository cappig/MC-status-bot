const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');
const sanitize = require('mongo-sanitize');
const { Permissions } = require('discord.js');
require('../modules/cache.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'setip',
    data: new SlashCommandBuilder()
        .setName('setip')
        .setDescription('set an ip that the bot will monitor')
        .addStringOption(option =>
            option.setName('ip')
            .setDescription('the server ip')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
            .setDescription('The server type')
            .setRequired(true)
            .addChoice('java', 'java')
            .addChoice('bedrock', 'bedrock')
        ),
    execute(message, args) {
        // Check if the person is admin
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            message.reply('You have to be a admin to use this command!');
            return;
        }
        if (!args.toString()) {
            message.reply('Please specify a valid IP!');
            return;
        }

        var ip = args[0].toString().toLowerCase();
        const bedrock = args[1] == 'bedrock' || args[1] == 'b' ? true : false

        // Write changes to database
        Server.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                "IP": sanitize(ip),
                "Bedrock": bedrock
            }, {
                useFindAndModify: false,
                new: true
            }).cache()
            .catch((err) => console.error(err))

        // Remove all logs
        Log.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                $set: {
                    logs: []
                }
            }, {
                useFindAndModify: false,
                new: true
            }).cache()
            .catch((err) => console.error(err))

        message.reply('The main IP has been set to: `' + args[0] + '`')
    }
}