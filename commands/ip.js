const { lookup } = require('../modules/cache.js');

module.exports = {
    name: 'ip',
    description: 'Get the default ip of the guild',
    admin: false,
    async execute(message) {
        // Fetch data from db
        // By using redis caching this function's execution time dropped from a average of 29ms to less then one
        const data = await lookup('Server', message.guild.id) 

        if (!data.IP) {
            message.channel.send('This server doest have a default ip set! A admin can do that by using the `mc!setip` command.');
        } else {
            if (data.Bedrock == true) message.channel.send("This server's default ip is `" + data.IP + "`. This is a bedrock server.");
            else message.channel.send("This server's default ip is `" + data.IP + "` This is a java server.");
        }
    }
}