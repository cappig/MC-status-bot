const { PingMC } = require("pingmc");
const Discord = require('discord.js');
const Server = require('../database/ServerSchema');

module.exports = {
    name:'ping',
    async execute(message, args) {
        var ip = "";
        if(!args[0]) {
            const data = await Server.findById({_id: message.guild.id})
                                    .catch((err) => console.error(err));

            if(!data.IP) {
                message.channel.send('Please specify a IP adress to ping!');
                return;
            } 

            ip = data.IP;
        } else {
            ip = args[0].split(':')[0].toLowerCase();
        }

        message.channel.startTyping();

        new PingMC (ip)
            .ping()
            .then((result) => {
                if (result.version) online(result);
                else offline(`${ip} didn't return a ping.`, ip);
            })
            .catch((error) => {
                if (error.code == "ENOTFOUND") offline(`Unable to resolve ${ip}.\nCheck if you entered the correct ip!`, ip);
                else if (error.code == "ECONNREFUSED") offline(`${ip} refused to connect.\nCheck if you specified the correct port!`, ip);
                else if (error.message == "Timed out") offline(`${ip} didn't return a ping.\nTimed out.`, ip);
                else console.log(error); return;
            })

        
        // Server is online
        function online (result) {
            // If there is no icon use pack.png
            if (result.favicon.icon == null) {
                var attachment = new Discord.MessageAttachment("https://i.ibb.co/YkRLWG8/down.png", "icon.png");
            } else {
                var attachment = new Discord.MessageAttachment(Buffer.from(result.favicon.icon.substr('data:image/png;base64,'.length), 'base64'), "icon.png")
            }
            const embed = new Discord.MessageEmbed()
                .setColor('#008000')
                .setTitle(`${ip} is online`)
                .setDescription(result.motd.clear);

            // Add a players coinnected field if available
            if (result.players.list.length > 0) {
                embed.addField('Players conncted:', '`' + result.players.list.join(' ') + '`', false)
            }

            embed
                .addFields(
                    { name: 'Playesrs: ', value: 'Online: ' + '`' + result.players.online + '`' + '\nMax: ' + '`' + result.players.max + '`', inline: true },
                    { name: 'Version: ', value: '`' + result.version.name + '`', inline: true }
                )
                .attachFiles(attachment)
                .setThumbnail("attachment://icon.png");

            message.channel.send(embed);
            message.channel.stopTyping();
            return;
        }

        // Server is offline or error
        function offline(errortxt, ip) {
            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${ip} is offline`)
                .setDescription(errortxt)
                .setThumbnail("https://i.ibb.co/YkRLWG8/down.png")
            message.channel.send(embed);

            message.channel.stopTyping();
            return;
        }
    }
}