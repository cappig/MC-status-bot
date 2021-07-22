const Server = require('../database/ServerSchema');
const Log = require('../database/logSchema');

module.exports = {
    name:'log',

    execute(message, args) {
        // Check if the person is admin
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        }

        if (!(args[0] == 'on' || args[0] == 'off') || !args[0]) {
            message.channel.send('Please specify a valid option (on/off)');
            return;
        }

        var logging = true;
        if (args == 'off') var logging = false;

        // Write to database
        Server.findByIdAndUpdate({_id: message.guild.id}, {"Logging": logging}, {useFindAndModify: false})
            .catch((err) => console.error(err))

        if (logging == true) {
            // Create a log document
            const log = new Log({
                _id: message.guild.id,
                logs: []
            });
            log.save()
                .catch((err) => console.error(err));
        } else {
            Log.findOneAndRemove({_id: message.guild.id}, {useFindAndModify: false})
                .catch((err) => console.error(err))
        }
        
        message.channel.send(`Logging has been turned ${args[0]}`)
    }
}