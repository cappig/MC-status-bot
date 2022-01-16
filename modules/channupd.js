const logger = require('../modules/nodeLogger.js')

module.exports = {
    execute(client, server, result) {
        // Check if channels are defined
        if (!server.StatusChannId || !server.NumberChannId || !server.CategoryId) return;
        if (!client.channels.cache.get(server.StatusChannId) || !client.channels.cache.get(server.NumberChannId) || !client.channels.cache.get(server.CategoryId)) return;

        try {
            // Change the name of the category to the right ip if it isn't
            if (!(client.channels.cache.get(server.CategoryId).name == server.IP + `'s status`)) {
                client.channels.cache.get(server.CategoryId).setName(server.IP + `'s status`).catch(e => logger.warn("Error in cahannupd:" + e));
            }

            // server is online
            if (result) {
                client.channels.cache.get(server.StatusChannId).setName('🟢 ONLINE').catch(e => logger.warn("Error in cahannupd:" + e));

                const chann = client.channels.cache.get(server.NumberChannId);
                chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
                    VIEW_CHANNEL: true
                }).catch(e => logger.warn("Error in cahannupd:" + e));
                chann.setName(`👥 Players online: ${result.players.online}`).catch(e => logger.warn("Error in cahannupd:" + e));
            }

            // server is offline
            else {
                client.channels.cache.get(server.StatusChannId).setName('🔴 OFFLINE').catch(e => logger.warn("Error in cahannupd:" + e));

                const chann = client.channels.cache.get(server.NumberChannId);
                chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
                    VIEW_CHANNEL: false
                }).catch(e => logger.warn("Error in cahannupd:" + e));
                chann.setName(`👥 Players online: 0`).catch(e => logger.warn("Error in cahannupd:" + e));
            }
        } catch (err) {
            console.error("Error in cahannupd: " + err);
        }
    }
}