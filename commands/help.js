const Discord = require('discord.js');

module.exports = {
    name:'help',

    execute(message) { 

        const description = 'This bot is still in early development. Please report any bugs on the [Github](https://github.com/cappig/MC-status-bot/issues)\n\n' +
                            '`mc!log` - turn logging on or of\n' +
                            '`mc!ping` - ping a minecraft server\n' +
                            '`mc!setip` - set a ip that the bot will monitor\n' +
                            '`mc!log` - turn logging on or of\n' +
                            '`mc!setup` - set up the channels that will display the status of a selected server\n' +
                            '`mc!rmchann` - removes the monitoring channels\n' +
                            '`mc!news` - get the latest articles from minecraft.net\n' +
                            '\n[Add to server](https://discord.com/api/oauth2/authorize?client_id=816747912888975362&permissions=8&scope=bot) | [Privacy policy](https://github.com/cappig/MC-status-bot/blob/main/miscellaneous/Privacy_policy.md) | [Github](https://github.com/cappig/MC-status-bot)'

        const embed = new Discord.MessageEmbed()
            .setColor('#008000')
            .setTitle('<a:cube:853751408389914644> About the bot')
            .setDescription(description)
            .setFooter('Made by Cappig#3296 | Check out by blog - cappig.ga')
        message.channel.send(embed);
    }
}