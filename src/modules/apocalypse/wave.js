const { send } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    const modRole = await this.mod.getModRole(msg.guild);

    const isMod = msg.member.roles.has(modRole);

    const waveText = x => `**Tonight's Wave:** \`${x}\``;

    if (isMod && args.length > 0) {
        // set the wave
        const wave = args.join(' ');
        await this.mod.setWave(msg.guild, wave);
        await send(msg.channel, waveText(wave));

    } else {
        // show the wave
        const wave = await this.mod.getWave(msg.guild);
        await send(msg.channel, waveText(wave));
    }

    return true;
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Show the current wave information'],
    ['<wave>', 'Set the current wave information']
]);

exports.config = {
    name: 'Wave',
    cmd: 'wave',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Checks the next Wave the players will face.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
