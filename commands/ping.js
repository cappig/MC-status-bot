const util = require('minecraft-server-util');
const Discord = require('discord.js');
const { lookup } = require('../modules/cache.js');

module.exports = {
    name: 'ping',
    async execute(message, args) {
        message.channel.sendTyping();

        if (!args[0]) {
            var data = await lookup('Server', message.guild.id);

            if (!data.IP) {
                message.channel.send('Please specify a IP address to ping!');
                return;
            }

            if (data.Bedrock == true) var bedrock = 'ඞ';

            var ip = data.IP.split(':')[0];
            var portnum = Number(data.IP.split(':')[1]);
        } else {
            var ip = args[0].split(':')[0].toLowerCase();
            var portnum = Number(args[0].split(':')[1]);
        }

        const port =  portnum < 65536 || portnum > 0 ? portnum : NaN;

        if (bedrock || args[1] == 'bedrock' || args[1] == 'b') {
            var pinger = util.statusBedrock(ip, port ? port : 19132)
        } else {
            var pinger = util.status(ip, port ? port : 25565)
        }

        pinger
            .then((result) => {
                console.log(result)
                if (result.version.protocol) online(result);
                else offline(`${ip} didn't return a ping.`, ip);
            })
            .catch((error) => {
                console.log(error)
                if (error.code == "ENOTFOUND") offline(`Unable to resolve ${ip}.\nCheck if you entered the correct ip!`, ip);
                else if (error.code == "ECONNREFUSED") offline(`Unable to resolve ${ip}.\nCan't find a route to the host!`, ip);
                else if (error.code == "EHOSTUNREACH") offline(`${ip} refused to connect.\nCheck if you specified the correct port!`, ip);
                else if (error.code == "ECONNRESET") offline(`${ip} abruptly closed the connection.\nThere is some kind of issue on the server side!`, ip);
                else if (error == "Error: Socket timed out while connecting") offline(`${ip} didn't return a ping.\nTimed out.`, ip);
                else {
                    console.log("A error occurred while trying to ping: ", error);
                    offline(`${ip} refused to connect.`, ip);
                }
                return;
            });

        // Server is online
        function online(result) {
            // If there is no icon use pack.png
            if (result.favicon == null) {
                var attachment = new Discord.MessageAttachment("https://i.ibb.co/YkRLWG8/down.png", "icon.png");
            } else {
                var attachment = new Discord.MessageAttachment(Buffer.from(result.favicon.substr('data:image/png;base64,'.length), 'base64'), "icon.png")
            }
            const embed = new Discord.MessageEmbed()
                .setColor('#008000')
                .setTitle(`${ip} is online`)
                .setDescription(result.motd.clean);

            // Add a players connected field if available
            if (result.players.samples && result.players.sample != null && result.players.sample.length > 0) {
                const playernames = result.players.sample.map( function(obj) {
                    return obj.name;
                });

                embed.addField('Players connected:', '`' + playernames.toString().replace(/,/g, ', ') + '`', false)
            }

            embed
                .addFields({
                    name: 'Players: ',
                    value: 'Online: ' + '`' + result.players.online + '`' + '\nMax: ' + '`' + result.players.max + '`',
                    inline: true
                }, {
                    name: 'Version: ',
                    value: '`' + result.version.name + '`',
                    inline: true
                })
                .setThumbnail("attachment://icon.png");

            message.channel.send({ embeds: [embed], files: [attachment] });
            
            return;
        }

        // Server is offline or error
        function offline(errortxt, ip) {
            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${ip} is offline`)
                .setDescription(errortxt + '\n\n *If the server you are trying to ping\n is a bedrock server use `mc!ping [ip] bedrock`*')
                .setThumbnail("https://i.ibb.co/YkRLWG8/down.png")
            message.channel.send({ embeds: [embed] });
            return;
        }
    }
}