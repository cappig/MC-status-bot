const { Client, Intents, Collection } = require('discord.js')
const { RateLimiter } = require('discord.js-rate-limiter')
const fs = require('fs')
const mongoose = require('mongoose')
require('dotenv').config()

const logger = require('./modules/nodeLogger.js')

const Log = require('./database/logSchema')
const Server = require('./database/ServerSchema')
const Redis = require('ioredis')

// Handle and log and crashes
process.on('uncaughtException', (error, source) => {
	logger.crash(error + 'at' + source)
	process.exit(1)
})

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
client.rateLimiter = new RateLimiter(1, 2000) // Rate limit to one message every two seconds
client.commands = new Collection()

logger.success('Starting the bot!')

// Connect to database
mongoose
	.connect(process.env.DBURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => logger.info('Connected to database!'))
	.catch((err) => logger.error(err))

const redisclient = new Redis({
	port: 6379,
	host: '127.0.0.1'
})

// Flush redis
redisclient.flushall('SYNC', async function (err, succeeded) {
	logger.info(`Flushing Redis -  ${err ? err : succeeded}`)

	// Cache the entire mongo database to redis.
	// Cache it only after redis gets flushed
	logger.info('Started caching the databases')

	await Log.find()
		.then((result) => {
			result.forEach((log) => redisclient.hset('Log', log._id, JSON.stringify(log.logs)))
			logger.info('Cached logs')
		})
		.catch((err) => logger.error(err))

	await Server.find()
		.then((result) => {
			result.forEach((server) => {
				var value = { ...server.toObject() } // Copy server object
				value._id = undefined // Remove the _id from the value
				redisclient.hset('Server', server._id, JSON.stringify(value))
			})
			logger.info('Cached servers')

			// Log the client in here to prevent the bot from starting before
			// the db has been completely cached.
			client.login(process.env.TOKEN)
		})
		.catch((err) => logger.error(err))
})

// Make the redis client global
global.redisclient = redisclient

// Command handling
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

// Event handling
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))
for (const file of eventFiles) {
	const event = require(`./events/${file}`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client))
	} else {
		client.on(event.name, (...args) => event.execute(...args, client))
	}
}
