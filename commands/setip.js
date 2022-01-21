const Server = require('../database/ServerSchema')
const Log = require('../database/logSchema')
const sanitize = require('mongo-sanitize')
const { Permissions } = require('discord.js')
const logger = require('../modules/nodeLogger.js')
require('../modules/cache.js')

module.exports = {
  name: 'setip',
  execute(message, args) {
    // Check if the person is admin
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && message.member.id != process.env.OWNERID.toString()) {
      message.channel.send('You have to be a admin to use this command!')
      return
    }
    if (!args.toString()) {
      message.channel.send('Please specify a valid IP!')
      return
    }

    var ip = args[0].toString().toLowerCase()
    const bedrock = args[1] == 'bedrock' || args[1] == 'b' ? true : false

    // Write changes to database
    Server.findByIdAndUpdate(
      {
        _id: message.guild.id
      },
      {
        IP: sanitize(ip),
        Bedrock: bedrock
      },
      {
        useFindAndModify: false,
        new: true
      }
    )
      .cache()
      .catch((err) => logger.error(err))

    // Remove all logs
    Log.findByIdAndUpdate(
      {
        _id: message.guild.id
      },
      {
        $set: {
          logs: []
        }
      },
      {
        useFindAndModify: false,
        new: true
      }
    )
      .cache()
      .catch((err) => logger.error(err))

    message.channel.send('The main IP has been set to: `' + args[0] + '`')
  }
}
