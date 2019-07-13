const { send, findRole } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (args.length === 0) {
        const modRole = await this.mod.getModRole(msg.guild);

        if (modRole) {
            const role = findRole(msg.guild, modRole);
            send(msg.channel, `The current mod role is ${role.name}.`);
        } else {
            send(msg.channel, 'There is no mod role currently set. Set one using `/setmod [role name]`.');
        }

    } else {
        const role = findRole(msg.guild, args.join(' '));

        await this.mod.setModRole(msg.guild, role.id);

        await send(msg.channel, `**${role.name}** has been set as the mod role!`);
    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Show the current mod role'],
    ['<role>', 'Change the mod role to <role>']
]);

exports.config = {
    name: 'Mod Role',
    cmd: 'modrole',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['ADMINISTRATOR'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Sets the Mod role',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
