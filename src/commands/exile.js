const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const discord = require('discord.js');
require('discord-reply'); //⚠️ IMPORTANT: put this before your discord.Client()
require('dotenv').config();

const config = {
    description: 'Exiles a user in the Roblox group.',
    aliases: [],
    usage: '<username> <reason>',
    rolesRequired: ['E | Ranking Permissions'],
    category: 'Ranking'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        let embed = new Discord.MessageEmbed();

        let msg = args.slice(1).join(" ");
        if(!msg) {
            embed.setDescription(`Missing arguments.\n\nUsage: \`${client.config.prefix}${path.basename(__filename).split('.')[0]}${' ' + config.usage || ''}\``);
            embed.setColor(client.config.colors.error);
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            embed.setTimestamp();
            return message.lineReply(embed);
        }

        let username = args[0];
        if(!username) {
            embed.setDescription(`Missing arguments.\n\nUsage: \`${client.config.prefix}${path.basename(__filename).split('.')[0]}${' ' + config.usage || ''}\``);
            embed.setColor(client.config.colors.error);
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.lineReply(embed);
        }

        let id;
        try {
            id = await roblox.getIdFromUsername(username);
        } catch (err) {
            embed.setDescription(`<:Bruh:862667091801800705> ${username} is not a Roblox user.`);
            embed.setColor(client.config.colors.error);
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.lineReply(embed);
        }

        let rankInGroup = await roblox.getRankInGroup(client.config.groupId, id);

        if(client.config.maximumRank <= rankInGroup) {
            embed.setDescription('<:Bruh:862667091801800705> This bot cannot rank this user due to the maximum rank configured.');
            embed.setColor(client.config.colors.error);
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.lineReply(embed);
        }

        if(rankInGroup === 0){
            embed.setDescription('<:Bruh:862667091801800705> That user is not in the group.');
            embed.setColor(client.config.colors.error);
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.lineReply(embed);
        }

        let linkedUser = await client.utils.getLinkedUser(message.author.id, message.guild.id);
        if(client.config.verificationChecks === true) {
            if(!linkedUser) {
                embed.setDescription('<:Bruh:862667091801800705> You must be verified on either of the sites below to use this command.\n\n**Bloxlink:** https://blox.link\n**RoVer:** https://verify.eryn.io');
                embed.setColor(client.config.colors.error);
                embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                return message.lineReply(embed);
            }

            if(linkedUser === 'RATE_LIMITS') {
                embed.setDescription('Verification checks are currently on cooldown.');
                embed.setColor(client.config.colors.error);
                embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                return message.lineReply(embed);
            }

            if(linkedUser == id) {
                embed.setDescription('<:Bruh:862667091801800705> You can\'t rank yourself!');
                embed.setColor(client.config.colors.error);
                embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                return message.lineReply(embed);
            }

            let linkedUserRankInGroup = await roblox.getRankInGroup(client.config.groupId, linkedUser);
            if(rankInGroup >= linkedUserRankInGroup) {
                embed.setDescription('You can only rank people with a rank lower than yours, to a rank that is also lower than yours.');
                embed.setColor(client.config.colors.error);
                embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                return message.lineReply(embed);
            }
        }

        let rankNameInGroup = await roblox.getRankNameInGroup(client.config.groupId, id);
        let rankingInfo;
        try {
            rankingInfo = await roblox.exile(client.config.groupId, id);
        } catch (err) {
            console.log(`Error: ${err}`);
            embed.setDescription('<:Bruh:862667091801800705> Oops! An unexpected error has occured. The bot owner can check the bot logs for more information.');
            embed.setColor(client.config.colors.error);
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.lineReply(embed);
        }

        embed.setDescription(`<a:fired:847902697340010517> **Success!** Exiled ${username} from the group.`);
        embed.setColor(client.config.colors.success);
        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
        message.lineReply(embed);

        if(client.config.logChannelId !== 'false') {
            let logEmbed = new Discord.MessageEmbed();
            let logChannel = await client.channels.fetch(client.config.logChannelId);
            logEmbed.setDescription(`**Moderator:** <@${message.author.id}> (\`${message.author.id}\`)\n**Action:** Exile\n**User:** ${username} (\`${id}\`)\n**Reason:**\n\`\`\`${msg}\`\`\``);
            logEmbed.setColor(client.config.colors.info);
            logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            logEmbed.setTimestamp();
            logEmbed.setThumbnail(`https://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`);
            return logChannel.send(logEmbed);
        } else {
            return;
        }
    }
}