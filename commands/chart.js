const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Discord = require('discord.js');
const Log = require('../database/logSchema');
const Server = require('../database/ServerSchema');

module.exports = {
    name:'chart',
    async execute(message, args) {

        if(!(args.toString() == 'playersonline' || args.toString() == 'uptime')) {
            message.channel.send(`Please specify what you want to chart! Use *mc!chart uptime* or *mc!chart playersonline*`);
            return;
        }

        message.channel.startTyping();

        // Get the logs
        const logs = await Log.findById({_id: message.guild.id})
                            .catch((err) => console.error(err));

        // Get the ip. data.IP holds the ip
        const data = await Server.findById({_id: message.guild.id})
                                .catch((err) => console.error(err));

        // Check if IP is undefined - if ip is undefined there are no logs
        if(!data.IP) {
            message.channel.send('There are no logs to chart!');
            return;
        } 

        var xlbl = [], ylbl = [];

        if (args == 'playersonline') { 
            // Set the options for chart.js
            var type = 'line',
                label = '# of players',
                embedtitle = `Number of players online on ${data.IP}`,
                fill = false;

            logs.logs.forEach(log => {
                if (log.online == false) ylbl.push(0);
                else ylbl.push(log.playersOnline);

                xlbl.push(`${log.timestamp.getHours()}:${log.timestamp.getMinutes()}`)
            })

            // Sort the array from smallest to largest
            var sorted = ylbl.sort((a, b) => a - b );
            
            var embeddescr = `There have been a maximum of ${sorted[sorted.length - 1]} players online at onece, and a minimum of ${sorted[0]}.`
        }
        if (args == 'uptime') {
            // uptime
            var up = 0, down = 0;

            // Set the options for chart.js
            var type = 'line',
                label = 'uptime',
                embedtitle = `Server uptime`,
                fill = true,
                max = 1;

            // calculate the uptime and percentage
            logs.logs.forEach(log => {
                if(log.online == true) { 
                    up++
                    ylbl.push(1);
                } else {
                    down++
                    ylbl.push(0);
                }

                xlbl.push(`${log.timestamp.getHours()}:${log.timestamp.getMinutes()}`)

            })
            var embeddescr = `${data.IP} was up for ${up * 5} minutes and down for ${down * 5} minutes. This means that ${data.IP} has a uptime percentage of ${(up/down * 100).toFixed(2)}`
        }

        // Change the width of the chart based on the number of lines in the log
        switch (true) {
            case (ylbl.length <= 30):
                var width = 500;
                break;
            case (ylbl.length <= 30):
                var width = 600;
                break;
            case (ylbl.length <= 30):
                var width = 700;
                break;
            case (ylbl.length <= 30):
                var width = 900;
                break;
            default:
                var width = 1000;
                break;
        }
        var height = 400;

        // Chart.js
        const chartCallback = (ChartJS) => ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
        (async () => {
            const configuration = {
                type,
                data: {
                    labels: xlbl,
                    datasets: [{
                        label,
                        data: ylbl,
                        fill,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1
                    }]
                },
                options: { 
                    legend: {
                        labels: {
                            fontColor: "rgb(247, 247, 247)",
                            fontSize: 15
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: "rgb(247, 247, 247)",
                                fontSize: 15,
                                stepSize: 1,
                                max,
                                callback: function(value, index, values) {
		                            if(args == 'uptime') { 
		                                if(value == 1) return 'online';
		                            	if(value == 0) return 'offline';
		                            } else return value;
                                }
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: "rgb(247, 247, 247)",
                                fontSize: 13,
                                stepSize: 1,
                            }
                        }]
                    }
                }
            };

            const image = await chartJSNodeCanvas.renderToBuffer(configuration);

            // Send embed
            const attachment = new Discord.MessageAttachment(image, "chart.png")
            const embed = new Discord.MessageEmbed()
                .setColor('#23272A')
                .setTitle(embedtitle)
                .attachFiles(attachment)
                .setDescription(embeddescr)
                .setImage("attachment://chart.png")
            message.channel.send(embed);
            message.channel.stopTyping();
        })();
    }
}