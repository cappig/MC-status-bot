const logError = require('../modules/error-log');
module.exports = {
    name: 'interactionCreate',
    execute(interaction, client) {
        if (!interaction.isCommand()) return console.log("no tcommmnad");
        if (interaction.channel.type == 'GUILD_DM') return console.log("is dm");

        // Check if user is rate limited
        const limited = client.rateLimiter.take(interaction.member.user.id);
        if (limited) return;

        const commandName = interaction.commandName;
        if (!client.commands.has(commandName)) return;
        const command = client.commands.get(commandName)

        try {
            command.execute(interaction, [], client);
        } catch (error) {
            logError(error);
            interaction.reply({ content: 'Uh, oh! An error occurred while trying to execute that command! (**X  _  X**)', allowedMentions: { repliedUser: false } })
        }
    }
}