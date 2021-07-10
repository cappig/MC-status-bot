const https = require('https');
const Discord = require('discord.js');

module.exports = {
    name:'news',
    async execute(message) {
        message.channel.send(`This command doesn't work at the moment :(`)
        
        /* For some reason the request would just time out. When I
         * tried to curl it gave me a 403. But I can still see the 
         * site in a browser.
         *
         * Im gonna look into this later.
        */
    }
}