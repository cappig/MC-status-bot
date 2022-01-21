const Server = require('../database/ServerSchema')
const { Permissions } = require('discord.js')
const setip = require('../commands/setip.js')
const util = require('minecraft-server-util')
const logger = require('../modules/nodeLogger.js')
const { lookup } = require('../modules/cache.js')

module.exports = {
	name: 'setup',
	async execute(message, args, client) {
		// Check if the person is admin
		if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && message.member.id != process.env.OWNERID.toString()) {
			message.channel.send('You have to be a admin to use this command!')
			return
		}

		if (args.length > 0) {
			try {
				setip.execute(message, args, client)
			} catch (error) {
				logger.error(error)
				message.reply({
					content: 'Uh, oh! An error occurred while trying to set the ip! (**X  _  X**)',
					allowedMentions: { repliedUser: false }
				})
			}
		}

		// Check if bot has all the permissions
		if (!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_CHANNELS])) {
			message.channel.send("I don't have the necessary permissions to perform this action! - `Manage roles` and `Manage channels`")
			return
		} else if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			message.channel.send("I don't have the necessary permissions to perform this action! - `Manage channels`")
			return
		} else if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
			message.channel.send("I don't have the necessary permissions to perform this action! - `Manage roles`")
			return
		}

		// Get the ip of the server
		const result = await lookup('Server', message.guild.id)
		const ip = result.IP.split(':')[0].toLowerCase()

		// check if server has a defined ip
		if (!ip) {
			message.channel.send('Please use`mc!setip` to set a ip to monitor!')
			return
		}

		// Check if monitoring channels already exist. if they do remove them
		if (result.StatusChannId) {
			await message.guild.channels.cache
				.get(result.StatusChannId)
				.delete()
				.catch((err) => logger.error(err))
		}
		if (result.NumberChannId) {
			await message.guild.channels.cache
				.get(result.NumberChannId)
				.delete()
				.catch((err) => logger.error(err))
		}
		if (result.CategoryId) {
			await message.guild.channels.cache
				.get(result.CategoryId)
				.delete()
				.catch((err) => logger.error(err))
		}

		// Create category
		let Category
		await message.guild.channels
			.create(`${ip}'s status`, {
				type: 'GUILD_CATEGORY',
				permissionOverwrites: [
					{
						id: message.guild.me.roles.highest,
						allow: ['CONNECT', 'VIEW_CHANNEL']
					},
					{
						id: message.guild.roles.everyone,
						deny: ['CONNECT']
					}
				]
			})
			.then((channel) => {
				Category = channel
			})

		// Crate channels and add to category
		let StatusChan
		await message.guild.channels
			.create('Updating status. . .', {
				type: 'GUILD_VOICE'
			})
			.then(async function (channel) {
				await channel.setParent(Category.id)
				StatusChan = channel
			})
		let NumberChan
		await message.guild.channels
			.create('Updating players . . .', {
				type: 'GUILD_VOICE'
			})
			.then(async function (channel) {
				await channel.setParent(Category.id)
				NumberChan = channel
			})

		// Write to database
		Server.findByIdAndUpdate(
			{
				_id: message.guild.id
			},
			{
				StatusChannId: StatusChan.id,
				NumberChannId: NumberChan.id,
				CategoryId: Category.id
			},
			{
				useFindAndModify: false,
				new: true
			}
		)
			.cache()
			.then(() => message.channel.send('The channels have been created successfully! Please allow up to five minutes for the channels to update.'))
			.catch((err) => logger.error(err))

		const portnum = parseInt(result.IP.split(':')[1])
		const port = portnum < 65536 && portnum > 0 ? portnum : undefined

		if (result.Bedrock == true) {
			var pinger = util.statusBedrock(ip.split(':')[0].toLowerCase(), port ? port : 19132)
		} else {
			var pinger = util.status(ip.split(':')[0].toLowerCase(), port ? port : 25565)
		}

		pinger
			.then((pingresult) => {
				// Aternos servers stay online and display Offline in their MOTD when they are actually offline
				if (!pingresult || (ip.includes('aternos.me') && pingresult.version == '● Offline')) {
					// server is offline
					servoffline()
				} else {
					// server is online
					servonline(pingresult)
				}
			})
			.catch((error) => {
				// server is offline
				servoffline()
			})

		async function servonline(pingresult) {
			// server is online
			await client.channels.cache.get(StatusChan.id).setName('🟢 ONLINE')
			const chann = client.channels.cache.get(NumberChan.id)
			await chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
				VIEW_CHANNEL: true
			})
			await chann.setName(`👥 Players online: ${pingresult.players.online}`)
		}
		async function servoffline() {
			await client.channels.cache.get(StatusChan.id).setName('🔴 OFFLINE')
			const chann = client.channels.cache.get(NumberChan.id)
			await chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
				VIEW_CHANNEL: false
			})
			await chann.setName(`👥 Players online: 0`)
		}
	}
}
