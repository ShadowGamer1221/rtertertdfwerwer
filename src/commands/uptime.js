const discord = require('discord.js');
require('discord-reply'); //⚠️ IMPORTANT: put this before your discord.Client()

const config = {
    description: 'Sends the uptime of the bot.',
    aliases: [],
    usage: '',
    rolesRequired: [],
    category: 'Utility'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        const time = require('ms')
        const uptime = time(client.uptime)
        message.lineReply({embed: {
            color: 39423,
            description: `The bot has been up for ${uptime}.`,
            footer: {
                text: client.user.username,
                icon_url: client.user.displayAvatarURL()
            },
            timestamp: new Date()
        }})
    }
}