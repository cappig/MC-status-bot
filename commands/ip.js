const Server = require('../database/ServerSchema');

module.exports = {
    name: 'ip',

    async execute(message) {
        // Fetch data from db
        const data = await Server.findById({
                _id: message.guild.id
            })
            .catch((err) => console.error(err));

        if (!data.IP) {
            message.channel.send('This server doest have a default ip set! A admin can do that by using the `mc!setip` command.');
            return;
        } else {
            message.channel.send("This server's default ip is `" + data.IP + "`");
            return;
        }
    }
}