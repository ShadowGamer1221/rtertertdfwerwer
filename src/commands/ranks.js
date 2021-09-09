// Command made by TypicallyShadow
// Any suggestions? Feel free to contact me.
// Feel free to change any of the footers but do not claim that you made this command as it can be completely rude.

const roblox = require("noblox.js");
const Discord = require("discord.js");
const discord = require('discord.js');
require('discord-reply'); //⚠️ IMPORTANT: put this before your discord.Client()
require('dotenv').config();

const config = {
    description: 'Returns a list of all ranks in the Roblox Group.',
    aliases: ['rank-list'],
    usage: '',
    rolesRequired: [],
    category: 'Ranking'
}

module.exports = {
  config,
  run: async (client, message, args) => {
    const getRoles = await roblox.getRoles(Number(client.config.groupId))
    const formattedRoles = getRoles.map((r) => `\`${r.name}\` - **\(${r.rank})\**`);

    const rankListEmbed = new Discord.MessageEmbed() 
      .setTitle('Eastside RankIDs:')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor(client.config.colors.ranklist)
      .setDescription(formattedRoles)
      .setFooter(``);
    message.lineReply(rankListEmbed)
  }
}