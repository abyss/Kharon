const { send } = require('../../includes/helpers');

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
    const base = await this.mod.getBase(msg.guild);

    const baseHP = base.currentHP;
    const baseMaxHP = base.maxHP;

    const baseHPText = (current, max) => `**Base HP:** \`${current}/${max}\``;

    const modRole = await this.mod.getModRole(msg.guild);
    const isNotMod = !msg.member.roles.has(modRole);

    if (isNotMod || args.length < 1) {
        // Showing current base HP (/base)
        await send(msg.channel, baseHPText(baseHP, baseMaxHP));

    } else if (args[0] === 'max' && args[1]) {
        // Setting base max hp (/base max NUM)

        let newBaseMaxHP = calculateHP(baseMaxHP, args[1]);
        if (isNaN(newBaseMaxHP)) return false;

        await this.mod.setBaseMaxHP(msg.guild, newBaseMaxHP);
        await send(msg.channel, baseHPText(baseHP, newBaseMaxHP));

    } else {
        // Setting base current hp (/base NUM)
        const newBaseHP = calculateHP(baseHP, args[0]);
        if (isNaN(newBaseHP)) return false;

        await this.mod.setBaseHP(msg.guild, newBaseHP);
        await send(msg.channel, baseHPText(newBaseHP, baseMaxHP));

    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Show the Base\'s current and max HP.'],
    ['[number]', 'Set the Base\'s Current HP'],
    ['max [number]', 'Set the Base\'s Max HP']
]);

exports.config = {
    name: 'Base HP',
    cmd: 'base',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Shows or sets the Base\'s current and max HP.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
