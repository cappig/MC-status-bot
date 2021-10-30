const Discord = require('discord.js');

module.exports = {
    name: 'bug',
    admin: false,
    description: 'Report a bug in the bot',
    execute(message, args, client) {
        const owner = client.users.cache.get(process.env.OWNERID)
        const bug = args.slice(0).join(' ');

        if (!bug) {
            message.channel.send('Please specify a bug that you would like to report.')
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle('New Bug report!')
                .addField('Author', message.author.toString(), true)
                .addField('Guild', `name: ${message.guild.name}\nid: ${message.guild.id}`, true)
                .addField('Report', bug)
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            owner.send({ embeds: [embed]});

            message.channel.send('Thank You for reporting a bug and helping to improve this bot! Your feedback is greatly appreciated!');
        }
    }
}