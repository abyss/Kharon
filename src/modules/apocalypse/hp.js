const { send, findUser } = require('../../includes/helpers');

function calculateHP(current, modifier) {
    if (modifier[0] === '+') {
        const add = parseInt(modifier.substring(1), 10);
        return current + add;
    }

    if (modifier[0] === '-') {
        const del = parseInt(modifier.substring(1), 10);
        return current - del;
    }

    return parseInt(modifier, 10);
}

exports.run = async (msg, args) => {
    const modRole = await this.mod.getModRole(msg.guild);
    const isMod = msg.member.roles.has(modRole);

    const hpText = (player, current, max) => `**${player} HP:**  \`${current}/${max}\``;

    if (args.length === 0){
        // /hp
        const stats = await this.mod.getPlayerStats(msg.guild, msg.member.id);
        if (stats) return send(msg.channel, hpText('Your', stats.currentHP, stats.maxHP));
        else return send(msg.channel, 'You are not a player.');
    } else if (args[0] === 'all') {
        // TODO: /hp all - displays all players' hp/max hp
        send(msg.channel, 'This command doesn\'t exist yet - coming soon');
    } else if (args[1] === 'max' && isMod) {
        // hp player max number
        const player = findUser(msg.guild, args[0]);
        if (!player) return send(msg.channel, '404 Player not found.');
        const stats = await this.mod.getPlayerStats(msg.guild, player.id);

        stats.maxHP = calculateHP(stats.maxHP, args[2]);
        await this.mod.setPlayerStats(msg.guild, player.id, stats);

        return send(msg.channel, hpText(`${player.displayName}'s`, stats.currentHP, stats.maxHP));
    } else if (args[1] && isMod) {
        // /hp player number
        const player = findUser(msg.guild, args[0]);
        if (!player) return send(msg.channel, '404 Player not found.');
        const stats = await this.mod.getPlayerStats(msg.guild, player.id);

        stats.currentHP = calculateHP(stats.currentHP, args[1]);
        await this.mod.setPlayerStats(msg.guild, player.id, stats);

        return send(msg.channel, hpText(`${player.displayName}'s`, stats.currentHP, stats.maxHP));
    } else {
        // /hp player
        const player = findUser(msg.guild, args[0]);
        if (!player) return send(msg.channel, '404 Player not found.');

        const stats = await this.mod.getPlayerStats(msg.guild, player.id);
        if (stats) return send(msg.channel, hpText(`${player.displayName}'s`, stats.currentHP, stats.maxHP));
        else return send(msg.channel, `${player.displayName} is not a player.`);
    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Display sender\'s HP values.'],
    ['[player]', 'Display [player]\'s HP values.'],
    ['[player] +/-number', 'Set the player\'s current HP.'],
    ['[player] max +/-number', 'Set the player\'s max HP.']
]);

exports.config = {
    name: 'HP',
    cmd: 'hp',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Shows and edits player HP.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
