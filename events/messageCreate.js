module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (message.author.bot) return;
        if (message.channel.type == 'GUILD_DM') return;
        if (!message.content.startsWith(client.prefix)) return;

        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;
        const command = client.commands.get(commandName)

        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply({ content: 'Uh, oh! An error occurred while trying to execute that command! (**X  _  X**)', allowedMentions: { repliedUser: false }})
        }
    }
}