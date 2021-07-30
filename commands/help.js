const Discord = require('discord.js');

module.exports = {
    name: 'help',

    execute(message) {

        const description = 'This bot is still in early development. Please report any bugs on [Github](https://github.com/cappig/MC-status-bot/issues)\n\n' +
            '`mc!ping` - ping a minecraft server\n' +
            '`mc!setip` - set an ip that the bot will monitor\n' +
            '`mc!log` - turn logging on or off\n' +
            '`mc!setup` - set up the channels that will display the status of a selected server\n' +
            '`mc!rmchann` - remove the monitoring channels\n' +
            '`mc!news` - see the latest articles from minecraft.net\n' +
            '`mc!chart` *uptime/playersonline/mostactive* - make a chart with the logged info\n' +
            '\n[Invite to a server](https://discord.com/oauth2/authorize?client_id=816747912888975362&scope=bot&permissions=268749904) | [Privacy policy](https://github.com/cappig/MC-status-bot/blob/main/miscellaneous/Privacy_policy.md) | [Github](https://github.com/cappig/MC-status-bot)'

        const embed = new Discord.MessageEmbed()
            .setColor('#008000')
            .setTitle('<a:cube:853751408389914644> About the bot')
            .setDescription(description)
            .setFooter('Made by Cappig#3296 | Check out by blog - cappig.ga')
        message.channel.send(embed);
    }
}