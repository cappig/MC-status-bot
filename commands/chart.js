const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const moment = require('moment')
const Discord = require('discord.js')
const { lookup } = require('../modules/cache.js')

module.exports = {
  name: 'chart',
  async execute(message, args) {
    if (!args.toString()) {
      message.channel.send('Please specify what you want to chart! Use `mc!chart uptime`, `mc!chart playersonline` or `mc!chart mostactive`')
      return
    }

    //message.channel.sendTyping();
    // Get the ip. data.IP holds the ip
    const data = await lookup('Server', message.guild.id)
    if (!data.Logging) {
      return message.channel.send('This server has logging set to off. please ask an admin to do `mc!log on`')
    }

    // Get the logs
    const logs = await lookup('Log', message.guild.id)
    // Check if logs exist
    if (logs.length <= 1 || logs == null || !data.IP) {
      message.channel.send("This server doesn't have any logs. Make sure that logging is turned on by using the `mc!log on` command.")
      return
    }

    var xLabels = [],
      yLabels = []

    if (args == 'playersonline') {
      // Check if logs are empty
      if (logs.length == 0) {
        message.channel.send('The logs are empty right now, please wait for them to update!')
        return
      }

      // Set the options for chart.js
      var type = 'line',
        label = 'number of players',
        line = 2,
        embedTitle = `Number of players online on ${data.IP}`

      logs.forEach((log) => {
        if (log.online == false) yLabels.push(0)
        else yLabels.push(log.playersOnline)

        xLabels.push(moment(log.timestamp).format('HH:mm'))
      })

      var embedDescription = `There have been a maximum of ${Math.max(...yLabels)} players online at once, and a minimum of ${Math.min(...yLabels)}.`
    } else if (args == 'uptime') {
      // Check if logs are empty
      if (logs.length == 0) {
        message.channel.send('The logs are empty right now, please wait for them to update!')
        return
      }

      // Set the options for chart.js
      var type = 'line',
        label = 'uptime',
        embedTitle = `${data.IP}'s uptime`,
        line = 2,
        max = 1

      var up = 0,
        down = 0

      // calculate the uptime and percentage
      logs.forEach((log) => {
        if (log.online == true) {
          up++
          yLabels.push(1)
        } else {
          down++
          yLabels.push(0)
        }
        xLabels.push(moment(log.timestamp).format('HH:mm'))
      })
      var embedDescription = `${data.IP} was up for ${up * 5} minutes and down for ${down * 5} minutes. This means that ${data.IP} has a uptime percentage of ${
        Math.round(((up / (up + down)) * 100 + Number.EPSILON) * 100) / 100
      }%`
    } else if (args == 'mostactive') {
      // Set the options for chart.js
      var type = 'bar',
        label = 'number of minutes played',
        line = 1,
        embedTitle = `Most active players on ${data.IP} in the last 24 hours`

      var numberOfOccurrences = {},
        playersList = []

      // Get all the players recorded in the logs into a array
      logs.forEach((log) => {
        if (log.playerNamesOnline) {
          const players = log.playerNamesOnline.split(',')
          playersList.push(...players)
        }
      })

      if (playersList.length == 0) {
        message.channel.send(`There were no player names logged. Either there were no players on the server or your server doesn't provide the list of connected players.`)
        return
      }

      // Create a object with the number of times a player has been online
      playersList.forEach(function (e) {
        if (numberOfOccurrences.hasOwnProperty(e)) numberOfOccurrences[e]++
        else numberOfOccurrences[e] = 1
      })

      // Sort it by the value
      const sorted = Object.entries(numberOfOccurrences)
        .sort(([c1, v1], [c2, v2]) => {
          return v2 - v1
        })
        .reduce((o, [k, v]) => ((o[k] = v), o), {})
      const arr = Object.entries(sorted)

      arr.forEach((element) => {
        xLabels.push(element[0])
        yLabels.push(element[1] * 5)
      })
      var embedDescription = `${xLabels[0]} was the most active player with ${yLabels[0]} minutes spent online in the last 24 hours.`
    } else {
      message.channel.send('mc!`' + args.toString() + "` isn't a valid option! Use `mc!chart uptime`, `mc!chart playersonline` or `mc!chart mostactive`")
      return
    }

    // Change the width of the chart based on the number of lines in the log
    switch (true) {
      case yLabels.length <= 30:
        var width = 500
        break
      case yLabels.length <= 40:
        var width = 600
        break
      case yLabels.length <= 50:
        var width = 700
        break
      case yLabels.length <= 60:
        var width = 900
        break
      default:
        var width = 1000
        break
    }

    // Chart.js
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height: 400
    })
    ;(async () => {
      const configuration = {
        type,
        data: {
          labels: xLabels,
          datasets: [
            {
              label,
              data: yLabels,
              fill: true,
              color: 'rgb(247, 247, 247)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: line,
              steppedLine: true
            }
          ]
        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgb(247, 247, 247)',
                font: {
                  size: 15
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'rgb(247, 247, 247)',
                fontSize: 15,
                stepSize: 1,
                max,
                callback: function (value) {
                  if (args == 'uptime') {
                    if (value == 1) return 'online'
                    if (value == 0) return 'offline'
                  } else return value
                }
              }
            },
            x: {
              ticks: {
                color: 'rgb(247, 247, 247)',
                fontSize: 13,
                stepSize: 1
              }
            }
          }
        }
      }

      const image = await chartJSNodeCanvas.renderToBuffer(configuration)

      // Send embed
      const attachment = new Discord.MessageAttachment(image, 'chart.png')
      const embed = new Discord.MessageEmbed().setColor('#23272A').setTitle(embedTitle).setDescription(embedDescription).setImage('attachment://chart.png')
      message.channel.send({ embeds: [embed], files: [attachment] })
    })()
  }
}
