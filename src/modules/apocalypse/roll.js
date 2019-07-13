const { send } = require('../../includes/helpers');
const { stripIndents } = require('common-tags');

const Roll = require('roll');
const roll = new Roll();

exports.run = async (msg, args) => {
    if (!roll.validate(args[0])) {
        await send(msg.channel, `**${args[0]}** is not a valid input string for rolling.`);
        return;
    }

    const outcome = roll.roll(args[0]);
    const rolled = outcome.rolled;

    const rollText = function (displayName, rolled, results, total) {
        return stripIndents`
            **${displayName}** rolled **${rolled}** and got:

            <:d20:303286541793624067> ${results}  =  **${total}**
        `;
    };

    if (Array.isArray(rolled[0])) {
        // is array of arrays (multiple dice)
        const multiRollArray = rolled.map(thisRoll => `\`${thisRoll.join(', ')}\``);
        const multiRoll = multiRollArray.join('  /  ');

        await send(msg.channel, rollText(msg.member.displayName, args[0], multiRoll, outcome.result));
    } else {
        // is array of not arrays (one die)
        const singleRoll = `\`${rolled.join(', ')}\``;
        await send(msg.channel, rollText(msg.member.displayName, args[0], singleRoll, outcome.result));
    }
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['XdY', 'Rolls XdY dice and returns the value']
]);

exports.config = {
    name: 'Roll',
    cmd: 'roll',
    alias: ['r'],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Rolls dice.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
