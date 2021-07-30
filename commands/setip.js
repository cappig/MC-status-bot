const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');

module.exports = {
    name: 'setip',

    execute(message, args) {
        // Check if the person is admin
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        }
        if (!args.toString()) {
            message.channel.send('Please specify a valid IP!');
            return;
        }

        // Write changes to databse
        Server.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                "IP": args[0]
            }, {
                useFindAndModify: false
            })
            .catch((err) => console.error(err))

        // Remove all logs
        Log.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                $set: {
                    logs: []
                }
            }, {
                useFindAndModify: false
            })
            .catch((err) => console.error(err))

        message.channel.send(`The main IP has been set to: ${args}`)
    }
}