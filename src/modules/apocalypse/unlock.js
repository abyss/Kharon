const { send } = require('../../includes/helpers');

exports.run = async (msg) => {

    const playerRole = await this.mod.getPlayerRole(msg.guild);
    const opts = { 'SEND_MESSAGES': true };
    const reason = 'ZABot: Unlock command usage';

    try {
        await msg.channel.overwritePermissions(playerRole, opts, reason);
        await send(msg.channel, ':unlock:');
    } catch (err) {
        send(msg.channel, 'Error: Does the bot have permissions over this channel?');
    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Unlocks the channel for players']
]);

exports.config = {
    name: 'Unlock',
    cmd: 'unlock',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Unlocks the channel for players.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
