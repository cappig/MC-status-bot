const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');
const { Permissions } = require('discord.js');
const { lookup } = require('../modules/cache.js');

module.exports = {
    name: 'setup',
    async execute(message, args) {
        // Check if the person is admin
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        }

        if (args.toString()) {
            // Write changes to database
            Server.findByIdAndUpdate({
                    _id: message.guild.id
                }, {
                    "IP": args[0]
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
            
                message.channel.send(`The ip has been set to ${args[0]}!`);
        }

        // Check if bot has all the permissions
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES) && !message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            message.channel.send("I don't have the necessary permissions to perform this action! - `Manage roles` and `Manage channels`");
            return;
        } else if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            message.channel.send("I don't have the necessary permissions to perform this action! - `Manage channels`");
            return;
        } else if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            message.channel.send("I don't have the necessary permissions to perform this action! - `Manage roles`");
            return;
        }

        // Get the ip of the server
        const result = await lookup('Server', message.guild.id);

        // check if server has a defined ip
        if (!result.IP) {
            message.channel.send('Please use`mc!setip` to set a ip to monitor!');
            return;
        }

        // Create category
        let Category;
        await message.guild.channels.create(`${result.IP}'s status`, {
            type: 'GUILD_CATEGORY',
            permissionOverwrites: [{
                id: message.guild.me.roles.highest,
                allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT']
            }]
        }).then((channel) => {
            channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                CONNECT: false
            });
            Category = channel;
        })

        // Crate channels and add to category
        let Status;
        await message.guild.channels.create('Updating status. . .', {
            type: 'GUILD_VOICE'
        }).then((channel) => {
            channel.setParent(Category.id);
            Status = channel;
        })
        let Number;
        await message.guild.channels.create('Updating players . . .', {
            type: 'GUILD_VOICE'
        }).then((channel) => {
            channel.setParent(Category.id);
            Number = channel;
        })

        // Write to database
        Server.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                "StatusChannId": Status.id,
                "NumberChannId": Number.id,
                "CategoryId": Category.id
            }, {
                useFindAndModify: false,
                new: true
            }).cache()
            .then(() => message.channel.send('The channels have been created successfully! Please allow up to five minutes for the channels to update.'))
            .catch((err) => console.error(err))
    }
}