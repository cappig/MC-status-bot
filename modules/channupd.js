const Server = require('../database/ServerSchema');

module.exports = {
    execute(client, server, result) {
        // Check if channels are defined
        if (!server.StatusChannId || !server.NumberChannId || !server.CategoryId) return;
        if (!client.channels.cache.get(server.StatusChannId) || !client.channels.cache.get(server.NumberChannId) || !client.channels.cache.get(server.CategoryId)) return;

        // Change the name of the category to the right ip if it isn't
        if (!(client.channels.cache.get(server.CategoryId).name == server.IP + `'s status`)) {
            client.channels.cache.get(server.CategoryId).setName(server.IP + `'s status`);
        }

        // server is online
        if (result) {
            client.channels.cache.get(server.StatusChannId).setName('🟢 ONLINE');

            const chann = client.channels.cache.get(server.NumberChannId);
            chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
                VIEW_CHANNEL: true
            });
            chann.setName(`👥 Players online: ${result.onlinePlayers}`);
        }

        // server is offline
        else {
            client.channels.cache.get(server.StatusChannId).setName('🔴 OFFLINE');

            const chann = client.channels.cache.get(server.NumberChannId);
            chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
                VIEW_CHANNEL: false
            });
            chann.setName(`👥 Players online: 0`);
        }
    }
}