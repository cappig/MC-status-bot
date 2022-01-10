const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'bug',
    data: new SlashCommandBuilder()
        .setName('bug')
        .setDescription('Report a bug in the bot.')
        .addStringOption(option =>
            option.setName('description')
            .setDescription('description of the bug to report')
            .setRequired(true)),
    execute(message, args, client) {
        const owner = client.users.cache.get(process.env.OWNERID);
        let bug = args.slice(0).join(' ');
        if (args.length <= 0) {
            bug = message.options.getString('description');
        }

        if (!bug) {
            return message.reply('Please specify a bug that you would like to report.')
        }
        const embed = new Discord.MessageEmbed()
            .setTitle('New Bug report!')
            .addField('Author', message.member.user.toString(), true)
            .addField('Guild', `name: ${message.guild.name}\nid: ${message.guild.id}`, true)
            .addField('Report', bug)
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        owner.send({ embeds: [embed] });

        message.reply('Thank You for reporting a bug and helping to improve this bot! Your feedback is greatly appreciated!');
    }
}