const { send, findUser, roll } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    const player = findUser(msg.guild, args[0]);
    if (!player) return send(msg.channel, '404 Player not found.');

    const stats = await this.mod.getPlayerStats(msg.guild, player.id);
    if (!stats) return send(msg.channel, `${player.displayName} is not a player.`);

    let output = '';

    // Player Attacks!
    for (let i = 0; i < stats.attacks; i++) {
        let outcome = roll(stats.damage);

        let rollResultsText;
        if (Array.isArray(outcome.dice[0])) {
            // is array of arrays (multiple dice)
            const multiRollArray = outcome.dice.map(thisRoll => `\`${thisRoll.join(', ')}\``);
            rollResultsText = multiRollArray.join('  /  ');

        } else {
            // is array of not arrays (one die)
            rollResultsText = `\`${outcome.dice.join(', ')}\``;
        }

        output += `${player.displayName} deals ${rollResultsText} = **${outcome.total}** damage.\n`;
    }

    await send(msg.channel, output);
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['<player>', 'Rolls that players attack.']
]);

exports.config = {
    name: 'Player Attacks',
    cmd: 'attack',
    alias: ['attacks'],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Rolls a random encounter between a player and a Shambler.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
