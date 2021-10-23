const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');
const { Permissions } = require('discord.js');
require('../modules/cache.js');


module.exports = {
    name: 'log',

    execute(message, args) {
        // Check if the person is admin
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        }

        if (args == 'on') var logging = true;
        else if (args == 'off') var logging = false;
        else {
            message.channel.send('Please specify a valid option (on/off)');
            return;
        }

        // Write to database
        Server.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                "Logging": logging
            }, {
                useFindAndModify: false,
                new: true
            }).cache()
            .catch((err) => console.error(err))

        if (logging == true) {
            // Create a log document
            Log.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                "logs": []
            }, {
                useFindAndModify: false,
                new: true,
                upsert: true
            }).cache()
                .catch((err) => {
                    // This code means that the document already exists. We can just ignore this since no new document is created
                    if (!err.code == 11000) {
                        console.error(err);
                    }
                })
                .then(message.channel.send(`Logging has been turned on`))
        } else {
            Log.findOneAndRemove({
                    _id: message.guild.id
                }, {
                    useFindAndModify: false,
                    new: true
                }).cache()
                .catch((err) => console.error(err))
                .then(message.channel.send(`Logging has been turned off`))
        }
    }
}