let Parser = require('rss-parser');
const Discord = require('discord.js');
let parser = new Parser();

module.exports = {
    name:'news',
    async execute(message) {
        let feed = await parser.parseURL('https://www.minecraft.net/en-us/feeds/community-content/rss');

        const embed = new Discord.MessageEmbed()
            .setColor('#008000')
            .setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/265/newspaper_1f4f0.png")
            .setTitle('The latest news: ')
            .setDescription('The latest articles posted on [minecraft.net](https://www.minecraft.net/) \nYou can read them in full there. \n‎‎ ‎')
            .addFields(
                { name: '1. ' + feed.items[0].title, value: feed.items[0].content + '\n*' + feed.items[0].pubDate.split(" ", 4).join(" ") + '*', inline: false },
                { name: '2. ' + feed.items[1].title, value: feed.items[1].content + '\n*' + feed.items[1].pubDate.split(" ", 4).join(" ") + '*', inline: false },
                { name: '3. ' + feed.items[2].title, value: feed.items[2].content + '\n*' + feed.items[2].pubDate.split(" ", 4).join(" ") + '*', inline: false },
                { name: '4. ' + feed.items[3].title, value: feed.items[3].content + '\n*' + feed.items[3].pubDate.split(" ", 4).join(" ") + '*', inline: false },
            )
        message.channel.send(embed);
    }
}