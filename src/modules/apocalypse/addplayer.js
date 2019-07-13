const { send, findUser } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    const defaultStats = {
        currentHP: 20,
        maxHP: 20,
        damage: '1d4'
    };

    const player = findUser(msg.guild, args[0]);
    if (!player) return send(msg.channel, '404 Player not found.');

    await this.mod.setPlayerStats(msg.guild, player.id, defaultStats);

    await send(msg.channel, `${player.displayName} has been added as a player.`);
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['<player>', 'Adds player with default stats.']
]);

exports.config = {
    name: 'Add Player',
    cmd: 'addplayer',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Adds a player with default stats.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
