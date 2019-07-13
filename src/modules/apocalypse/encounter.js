const { send, findUser } = require('../../includes/helpers');
const { stripIndents } = require('common-tags');

const Roll = require('roll');
const roll = new Roll();

const shamblerDamage = '1d6+2';
const shamblerMaxHP = 7;

exports.run = async (msg, args) => {
    let shamblerHP = shamblerMaxHP;

    const player = findUser(msg.guild, args[0]);
    if (!player) return send(msg.channel, '404 Player not found.');

    const stats = await this.mod.getPlayerStats(msg.guild, player.id);
    const playerHP = () => `**${stats.currentHP}/${stats.maxHP}**`;

    let output = '';
    while(stats.currentHP > 0 && shamblerHP > 0) {
        // Shambler Attacks!
        let result = roll.roll(shamblerDamage).result;
        stats.currentHP -= result;
        output += `The Shambler does **${result}** damage to ${player.displayName}, leaving them with ${playerHP()} HP.\n`;
        if (stats.currentHP <= 0) break;

        // Player Attacks!
        let outcome = roll.roll(stats.damage);
        shamblerHP -= outcome.result;

        let rollResultsText;
        if (Array.isArray(outcome.rolled[0])) {
            // is array of arrays (multiple dice)
            const multiRollArray = outcome.rolled.map(thisRoll => `\`${thisRoll.join(', ')}\``);
            rollResultsText = multiRollArray.join('  /  ');

        } else {
            // is array of not arrays (one die)
            rollResultsText = `\`${outcome.rolled.join(', ')}\``;
        }

        output += `${player.displayName} does ${rollResultsText} = **${outcome.result}** damage to the Shambler, leaving it with **${shamblerHP}** HP. \n\n`;
    }

    if (shamblerHP <= 0)
        output += stripIndents`
            :tada: **${player.displayName} has defeated the Shambler!** :tada:

            ${player.displayName} ends the fight with ${playerHP()} **HP**.
        `;
    else {
        stats.currentHP = 1;
        output += '\n';
        output += stripIndents`
            <:zombie:599093779395248138> **Unfortunately, the Shambler has defeated ${player.displayName}!** <:zombie:599093779395248138>

            ${player.displayName} stumbles home empty handed, and their HP is set to ${playerHP()}.
        `;
    }

    await this.mod.setPlayerStats(msg.guild, player.id, stats);
    await send(msg.channel, output);
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['<player>', 'Rolls a random encounter between the player and a Shambler.']
]);

exports.config = {
    name: 'Random Encounter',
    cmd: 'encounter',
    alias: ['enc'],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Rolls a random encounter between a player and a Shambler.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};