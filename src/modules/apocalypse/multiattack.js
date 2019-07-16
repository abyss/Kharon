const { send, findUser } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (args.length < 1) return false;

    const player = findUser(msg.guild, args[0]);
    if (!player) return send(msg.channel, '404 Player not found.');

    const stats = await this.mod.getPlayerStats(msg.guild, player.id);
    if (!stats) return send(msg.channel, `${player.displayName} is not a player.`);

    if (args.length === 1) {
        await send(msg.channel, `${player.displayName}'s number of attacks is ${stats.attacks}.`);
    } else {
        const num = parseInt(args[1], 10);
        if (isNaN(num)) return send(msg.channel, 'Invalid number of attacks.');

        stats.attacks = num;
        await this.mod.setPlayerStats(msg.guild, player.id, stats);

        await send(msg.channel, `${player.displayName}'s number of attacks has been updated to be ${stats.attacks}.`);
    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['<player>', 'Show the player\'s number of attacks'],
    ['<player> <#>', 'Sets the player\'s number of attacks to #.']
]);

exports.config = {
    name: 'Multiple Attacks',
    cmd: 'multiattack',
    alias: ['multiattacks', 'multi', 'numattacks'],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Sets a player\'s number of attacks',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
