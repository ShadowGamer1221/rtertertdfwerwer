const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const discord = require('discord.js');
require('discord-reply'); //⚠️ IMPORTANT: put this before your discord.Client()
require('dotenv').config();

const config = {
    description: 'Posts a shift shout in the Roblox group.',
    aliases: [],
    usage: '',
    rolesRequired: ['High Rank', 'Super High Rank'],
    category: 'Group Shouts'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        let embed = new Discord.MessageEmbed();

        let shouting = ('Greetings! There is a shift being hosted. Join for a chance of being promoted! ~| GAME LINK: https://www.roblox.com/games/6589778170/Eastside-Cafe-Training-Center?')

        let shoutInfo;
        try {
            shoutInfo = await roblox.shout(client.config.groupId, shouting);
        } catch (err) {
            console.log(`Error: ${err}`);
            embed.setDescription('Oops! An unexpected error has occured. The bot owner can check the bot logs for more information.');
            embed.setColor(client.config.colors.error);
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            embed.setTimestamp();
            return message.lineReply(embed);
        }

        embed.setDescription(`<a:ranked:847906614501441593> **Success!** Posted the shift shout!`);
        embed.setColor(client.config.colors.success);
        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
        embed.setTimestamp();
        message.lineReply(embed);

        if(client.config.logChannelId !== 'true') {
            let logEmbed = new Discord.MessageEmbed();
            let logChannel = await client.channels.fetch(client.config.logChannelId);
            logEmbed.setDescription(`**Moderator:** <@${message.author.id}> (\`${message.author.id}\`)\n**Action:** Training shout`);
            logEmbed.setColor(client.config.colors.info);
            logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            logEmbed.setTimestamp();
            return logChannel.send(logEmbed);
        } else {
            return;
        }
    }
}
