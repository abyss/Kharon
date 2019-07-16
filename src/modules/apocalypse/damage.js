const { send, findUser, validateRoll } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (args.length < 1) return false;

    const player = findUser(msg.guild, args[0]);
    if (!player) return send(msg.channel, '404 Player not found.');

    const stats = await this.mod.getPlayerStats(msg.guild, player.id);
    if (!stats) return send(msg.channel, `${player.displayName} is not a player.`);

    if (args.length === 1) {
        await send(msg.channel, `${player.displayName}'s damage is ${stats.damage}.`);
    } else {
        if (!validateRoll(args[1])) return send(msg.channel, 'Invalid damage roll.');

        stats.damage = args[1];
        await this.mod.setPlayerStats(msg.guild, player.id, stats);
        await send(msg.channel, `${player.displayName}'s damage has been updated to be ${stats.damage}.`);
    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['<player> XdY', 'Sets the player\'s damage die.']
]);

exports.config = {
    name: 'Damage',
    cmd: 'damage',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Sets a player\'s damage die',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
