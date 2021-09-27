const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Discord = require('discord.js');
const Log = require('../database/logSchema');
const Server = require('../database/ServerSchema');


module.exports = {
    name: 'chart',
    async execute(message, args) {

        if (!args.toString()) {
            message.channel.send("Please specify what you want to chart! Use `mc!chart uptime`, `mc!chart playersonline` or `mc!chart mostactive`");
            return;
        }

        message.channel.sendTyping();

        // Get the logs
        const logs = await Log.findById({
                _id: message.guild.id
            })
            .catch((err) => console.error(err));

        // Get the ip. data.IP holds the ip
        const data = await Server.findById({
                _id: message.guild.id
            })
            .catch((err) => console.error(err));

        // Check if logs exist
        if (logs == null || !data.IP) {
            message.channel.send("This server doesn't have any logs. Make sure that logging is turned on by using the `mc!log on` command.");
            return;
        }

        var xlbl = [], ylbl = [];

        if (args == 'playersonline') {
            // Check if logs are empty
            if (logs.logs.length == 0) {
                message.channel.send('The logs are empty right now, please wait for them to update!');
                return;
            }

            // Set the options for chart.js
            var type = 'line',
                xtype = 'time',
                label = 'number of players',
                line = 2,
                embedtitle = `Number of players online on ${data.IP}`;

            logs.logs.forEach(log => {
                if (log.online == false) ylbl.push(0);
                else ylbl.push(log.playersOnline);

                xlbl.push(log.timestamp);
            })

            var embeddescr = `There have been a maximum of ${Math.max( ...ylbl )} players online at onece, and a minimum of ${Math.min( ...ylbl )}.`
        }
        else if (args == 'uptime') {
            // Check if logs are empty
            if (logs.logs.length == 0) {
                message.channel.send('The logs are empty right now, please wait for them to update!');
                return;
            }

            // Set the options for chart.js
            var type = 'line',
                xtype = 'time',
                label = 'uptime',
                embedtitle = `${data.IP}'s uptime`,
                line = 2,
                max = 1;

            var up = 0,
                down = 0;

            // calculate the uptime and percentage
            logs.logs.forEach(log => {
                if (log.online == true) {
                    up++
                    ylbl.push(1);
                } else {
                    down++
                    ylbl.push(0);
                }
                xlbl.push(log.timestamp);
            })
            var embeddescr = `${data.IP} was up for ${up * 5} minutes and down for ${down * 5} minutes. This means that ${data.IP} has a uptime percentage of ${(up / (up+down)*100).toFixed(2)}%`
        } 
        else if (args == 'mostactive') {
            // Set the options for chart.js
            var type = 'bar',
                label = 'number of minutes played',
                line = 1,
                embedtitle = `Most active players on ${data.IP} in the last 24 hours`;

            var embeddescr = ``, numberofocc = {}, playerslist = [];

            // Get all the players recorded in the logs into a array
            logs.logs.forEach(log => {
                if (log.playerNamesOnline) {
                    const players = log.playerNamesOnline.split(",");
                    playerslist.push(...players);
                }
            });

            if (playerslist.length == 0) {
                message.channel.send(`There were no player names logged. Either there were no players on the server or your server doesn't provide the list of connected players.`);
                return;
            }

            // Create a object with the number of times a player has been online
            playerslist.forEach(function(e) {
                if (numberofocc.hasOwnProperty(e)) numberofocc[e]++
                else numberofocc[e] = 1;
            })

            // Sort it by the value
            const sorted = Object.entries(numberofocc).sort(([c1, v1], [c2, v2]) => { return v2 - v1 }).reduce((o, [k, v]) => (o[k] = v, o), {});
            const arr = Object.entries(sorted);

            arr.forEach(element => {
                xlbl.push(element[0]);
                ylbl.push(element[1] * 5);
            });
        } 
        else {
            message.channel.send("mc!`" + args.toString() + "` isnt a valid option! Use `mc!chart uptime`, `mc!chart playersonline` or `mc!chart mostactive`")
        }

        // Change the width of the chart based on the number of lines in the log
        switch (true) {
            case (ylbl.length <= 30):
                var width = 500;
                break;
            case (ylbl.length <= 40):
                var width = 600;
                break;
            case (ylbl.length <= 50):
                var width = 700;
                break;
            case (ylbl.length <= 60):
                var width = 900;
                break;
            default:
                var width = 1000;
                break;
        }

        // Chart.js
        const chartJSNodeCanvas = new ChartJSNodeCanvas({
            width,
            height: 400
        });
        (async () => {
            const configuration = {
                type,
                data: {
                    labels: xlbl,
                    datasets: [{
                        label,
                        data: ylbl,
                        fill: true,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: line,
                        steppedLine: true
                    }]
                },
                options: {
                    elements: {
                        point: {
                            radius: 0
                        }
                    },
                    legend: {
                        labels: {
                            fontColor: "rgb(247, 247, 247)",
                            fontSize: 15
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "rgb(247, 247, 247)",
                                fontSize: 15,
                                stepSize: 1,
                                max,
                                callback: function(value) {
                                    if (args == 'uptime') {
                                        if (value == 1) return 'online';
                                        if (value == 0) return 'offline';
                                    } else return value;
                                }
                            }
                        }],
                        xAxes: [{
                            type: xtype,
                            time: {
                                unit: 'hour'
                            },
                            ticks: {
                                fontColor: "rgb(247, 247, 247)",
                                fontSize: 13,
                                stepSize: 1
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
                .setDescription(embeddescr)
                .setImage("attachment://chart.png")
            message.channel.send({ embeds: [embed], files: [attachment] });
        })();
    }
}