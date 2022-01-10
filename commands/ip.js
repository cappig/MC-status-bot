const { lookup } = require('../modules/cache.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'ip',
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('return the default ip of the server'),
    async execute(message) {
        // Fetch data from db
        // By using redis caching this function's execution time dropped from a average of 29ms to less then one
        const data = await lookup('Server', message.guild.id)

        if (!data.IP) {
            message.reply('This server doest have a default ip set! A admin can do that by using the `mc!setip` command.');
        } else {
            if (data.Bedrock == true) message.reply("This server's default ip is `" + data.IP + "`. This is a bedrock server.");
            else message.reply("This server's default ip is `" + data.IP + "` This is a java server.");
        }
    }
}