const { send, findUser, validateRoll } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (args.length < 1) return false;

    const player = findUser(msg.guild, args[0]);
    if (!player) return send(msg.channel, '404 Player not found.');

    const stats = await this.mod.getPlayerStats(msg.guild, player.id);
    if (!stats) return send(msg.channel, `${player.displayName} is not a player.`);

    if (args.length === 1) {
        await send(msg.channel, `${player.displayName}'s armour is ${stats.armour}.`);
    } else {
        if (!validateRoll(args[1])) return send(msg.channel, 'Invalid armour roll.');

        stats.armour = args[1];
        await this.mod.setPlayerStats(msg.guild, player.id, stats);
        await send(msg.channel, `${player.displayName}'s armour has been updated to be ${stats.armour}.`);
    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['<player> XdY', 'Sets the player\'s armour die.']
]);

exports.config = {
    name: 'Armour',
    cmd: 'armour',
    alias: ['armor'],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Sets a player\'s armour die',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
