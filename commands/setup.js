const Server = require('../database/ServerSchema');

module.exports = {
    name:'setup',
    async execute(message) {
        // Check if the person is admin
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        }

        if(!message.guild.me.hasPermission("ADMINISTRATOR")) {
            message.channel.send('I have to have an administrator permission in order to set up and update the channels!');
            return;
        }

        // Get the ip of the server
        const result = await Server.findById(message.guild.id)
                                .catch((err) => console.error(err));

        // check if server has a defined ip
        if(!result.IP){ 
            message.channel.send('Please use`mc!setip` to set a ip to monitor!');
            return;
        }

        // Create category
        let Category;
        await message.guild.channels.create(`${result.IP}'s status`, {
            type: 'category'
        }) .then((channel) => {
            channel.updateOverwrite(channel.guild.roles.everyone, { CONNECT: false });
            Category = channel;
        })

        // Crate channels and add to category
        let Status;
        await message.guild.channels.create('Updating status. . .', {
            type: 'voice'
        }) .then((channel) => {
            channel.setParent(Category.id);
            Status = channel;
        })
        let Number;
        await message.guild.channels.create('Updating players . . .', {
            type: 'voice'
        }) .then((channel) => {
            channel.setParent(Category.id);
            Number = channel;
        })

        // Write to database
        Server.findByIdAndUpdate({_id: message.guild.id}, {"StatusChannId": Status.id, "NumberChannId": Number.id, "CategoryId": Category.id}, {useFindAndModify: false})
            .then(() => message.channel.send('The channels heve been created sucesfuly!'))
            .catch((err) => console.error(err))
    }
}