const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');
const { Permissions } = require('discord.js');
const { lookup } = require('../modules/cache.js');

module.exports = {
    name: 'setup',
    async execute(message, args, client) {
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

        // Check if monitoring channels already exist. if they do remove them
        if (result.StatusChannId && result.NumberChannId && result.CategoryId) {
            // Remove the channels
            try {
                await message.guild.channels.cache.get(result.StatusChannId).delete();
                await message.guild.channels.cache.get(result.NumberChannId).delete();
                await message.guild.channels.cache.get(result.CategoryId).delete();
            } catch (err) {
                if (!err == "TypeError: Cannot read properties of undefined (reading 'delete')") console.error(err);
            }
        }

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
        }).then(async function(channel) {
            await channel.setParent(Category.id);
            Status = channel;
        })
        let Number;
        await message.guild.channels.create('Updating players . . .', {
            type: 'GUILD_VOICE'
        }).then(async function(channel) {
            await channel.setParent(Category.id);
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

        // Fetch server status

        new PingMC(result.IP)
            .ping()
            .then((pingresult) => {
                // Aternos servers stay online and display Offline in their MOTD when they are actually offline
                if ((result.IP.includes('aternos.me') && pingresult.version.name == '● Offline') || !pingresult) {
                    // server is offline
                    servoffline();
                }
                else {
                    // server is online
                    servonline(pingresult);
                }
            })
            .catch((error) => {
                // Console log errors exept the ones that indiacte that a server is offline
                if (!(error.code == "ENOTFOUND" || error.code == "ECONNREFUSED" || error.code == "EHOSTUNREACH" || error.code == "ECONNRESET" || error.message == "Timed out")) {
                    console.error('An error occurred in the pinger module:' + error);
                }
                // server is offline
                servoffline();
                return;
            })

        async function servonline(pingresult) {
            // server is online
            await client.channels.cache.get(Status.id).setName('🟢 ONLINE');
            const chann = client.channels.cache.get(Number.id);
            await chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
                VIEW_CHANNEL: true
            });
            await chann.setName(`👥 Players online: ${pingresult.players.online}`)
        }
        function servoffline() {
            client.channels.cache.get(Status.id).setName('🔴 OFFLINE');
            const chann = client.channels.cache.get(Number.id);
            chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
                VIEW_CHANNEL: false
            });
        }
    }
}