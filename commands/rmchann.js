const Server = require('../database/ServerSchema');

module.exports = {
    name: 'rmchann',
    async execute(message) {

        // Check if the person is admin
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        }

        // Get the db entry for id
        const result = await Server.findById(message.guild.id)

        // server didnt define a ip or id of all the channels
        if (!result.StatusChannId || !result.NumberChannId || !result.CategoryId) {
            message.channel.send('This server doest have the monitoring channels set up. use `mc!setup` to do so.');
            return;
        }

        // Remove the channels
        message.guild.channels.cache.get(result.StatusChannId).delete();
        message.guild.channels.cache.get(result.NumberChannId).delete();
        message.guild.channels.cache.get(result.CategoryId).delete();

        // Remove from db
        Server.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                $unset: {
                    StatusChannId: "",
                    NumberChannId: "",
                    CategoryId: ""
                }
            }, {
                useFindAndModify: false
            })
            .then(() => message.channel.send('The channels heve been removed!'))
            .catch((err) => console.error(err))
    }
}