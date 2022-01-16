const logger = require('../modules/nodeLogger.js')

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        // check if the command exist
        const args = message.content.slice(3).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        if (!client.commands.has(commandName)) return;

        // Ignore messages:
        // if the message starts with the prefix
        if (!message.content.startsWith('mc!')) return;
        // if the bot is the author
        if (message.author.bot) return;
        // if its a dm
        if (message.channel.type == 'GUILD_DM') return;
        // if its a reply
        if (message.type === 'REPLY') return;

        // Check if user is rate limited
        const limited = client.rateLimiter.take(message.author.id);
        if (limited) return; // No response is sent if the user is rate limited 

        const command = client.commands.get(commandName)

        try {
            command.execute(message, args, client);
        } catch (error) {
            logger.error(error);
            message.reply({ content: 'Uh, oh! An error occurred while trying to execute that command! (**X  _  X**)', allowedMentions: { repliedUser: false }})
        }
    }
}