const { send, findRole } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (args.length === 0) {
        const playerRole = await this.mod.getPlayerRole(msg.guild);

        if (playerRole) {
            const role = findRole(msg.guild, playerRole);
            send(msg.channel, `The current player role is ${role.name}.`);
        } else {
            send(msg.channel, 'There is no player role currently set. Set one using `/setplayer [role name]`.');
        }

    } else {
        const role = findRole(msg.guild, args.join(' '));
        await this.mod.setPlayerRole(msg.guild, role.id);
        await send(msg.channel, `**${role.name}** has been set as the player role!`);
    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Show the current player role'],
    ['<role>', 'Change the player role to <role>'],
]);

exports.config = {
    name: 'Player',
    cmd: 'playerrole',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Sets the Player role for the game.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
