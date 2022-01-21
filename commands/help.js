const Discord = require('discord.js')

module.exports = {
	name: 'help',

	execute(message) {
		const description =
			'Please report any bugs that you encounter on [Github](https://github.com/cappig/MC-status-bot/issues) or use the `mc!bug` command!\n' +
			'> By putting the word bedrock or just the letter b after an ip the bot will ping this ip using the bedrock protocol.\n\n' +
			'**Admin commands:**\n' +
			'`mc!setip [ip] [bedrock]` - set an ip that the bot will monitor\n' +
			'`mc!log [on/off]` - turn logging on or off\n' +
			'`mc!setup [ip] [bedrock]` - set up the channels that will display the status of a selected server\n' +
			'`mc!rmchann` - remove the monitoring channels\n' +
			'\n**User commands:**\n' +
			'`mc!ip` - return the default ip of the server\n' +
			'`mc!ping [ip] [bedrock]` - ping a minecraft server\n' +
			'`mc!news` - see the latest articles from minecraft.net\n' +
			'`mc!chart [uptime/playersonline/mostactive]` - make a chart with the logged info\n' +
			'`mc!bug [bug]` - Report a bug in the bot\n' +
			'\n[Invite to a server](https://discord.com/oauth2/authorize?client_id=816747912888975362&scope=bot&permissions=268749904) | [Privacy policy](https://github.com/cappig/MC-status-bot/blob/main/miscellaneous/Privacy_policy.md) | [Github](https://github.com/cappig/MC-status-bot) | [Support server](https://discord.gg/YzX5KdF4kq)'

		const embed = new Discord.MessageEmbed()
			.setColor('#008000')
			.setTitle('<a:cube:892129423141269535> About the bot')
			.setDescription(description)
			.setFooter({ text: 'Made by Cappig#3296 | Check out by blog - cappig.ga' })
		message.channel.send({ embeds: [embed] })
	}
}
