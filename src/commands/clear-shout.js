const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const discord = require('discord.js');
require('discord-reply'); //⚠️ IMPORTANT: put this before your discord.Client()
require('dotenv').config();

const config = {
    description: 'Clears the shout in the Roblox group.',
    aliases: ['clearshout'],
    usage: '',
    rolesRequired: ['E | Ranking Permissions', 'E | Shout Permissions'],
    category: 'Group Shouts'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        let embed = new Discord.MessageEmbed();


        let shoutInfo;
        try {
            shoutInfo = await roblox.shout(client.config.groupId, '');
        } catch (err) {
            console.log(`Error: ${err}`);
            embed.setDescription('Oops! An unexpected error has occured. The bot owner can check the bot logs for more information.');
            embed.setColor(client.config.colors.error);
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            embed.setTimestamp();
            return message.lineReply(embed);
        }

        embed.setDescription(`<a:fired:847902697340010517> **Success!** Cleared the group shout.`);
        embed.setColor(client.config.colors.success);
        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
        embed.setTimestamp();
        message.lineReply(embed);

        if(client.config.logChannelId !== 'false') {
            let logEmbed = new Discord.MessageEmbed();
            let logChannel = await client.channels.fetch(client.config.logChannelId);
            logEmbed.setDescription(`**Moderator:** <@${message.author.id}> (\`${message.author.id}\`)\n**Action:** Cleared Shout`);
            logEmbed.setColor(client.config.colors.info);
            logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            logEmbed.setTimestamp();
            return logChannel.send(logEmbed);
        } else {
            return;
        }
    }
}
