const { send, findUser } = require('../../includes/helpers');
const { stripIndents } = require('common-tags');

const Roll = require('roll');
const roll = new Roll();

const runnerDmgRoll = '2d6+2';
const runnerMaxHP = 15;

exports.run = async (msg, args) => {
    let runnerHP = runnerMaxHP;


    if (args.length === 0){

        const result = roll.roll(runnerDmgRoll).result;
        send(msg.channel, `The Runner rolls ${runnerDmgRoll} and attacks for: **${result}** damage.`);

    } else if (args[0] === 'hp') {
        send(msg.channel, `**Runner HP:** \`${runnerMaxHP}\``);
    } else {
        const player = findUser(msg.guild, args[0]);
        if (!player) return send(msg.channel, '404 Player not found.');

        const stats = await this.mod.getPlayerStats(msg.guild, player.id);
        if (!stats) return send(msg.channel, `${player.displayName} is not a player.`);

        const playerHP = () => `**${stats.currentHP}/${stats.maxHP}**`;

        let output = '';
        while(stats.currentHP > 0 && runnerHP > 0) {
            // runner Attacks!
            let runnerDamage = roll.roll(runnerDmgRoll).result;
            let armourReduction = 0;
            if (stats.armour) armourReduction = roll.roll(stats.armour).result;

            let result = Math.max(0, runnerDamage-armourReduction);

            stats.currentHP -= result;
            if (armourReduction) output += `The runner does \`${runnerDamage}-${armourReduction}\` = **${result}** damage to ${player.displayName}, leaving them with ${playerHP()} HP.\n`;
            else output += `The runner does **${result}** damage to ${player.displayName}, leaving them with ${playerHP()} HP.\n`;

            if (stats.currentHP <= 0) break;

            // Player Attacks!
            for (let i = 0; i < stats.attacks; i++) {
                let outcome = roll.roll(stats.damage);
                runnerHP -= outcome.result;

                let rollResultsText;
                if (Array.isArray(outcome.rolled[0])) {
                    // is array of arrays (multiple dice)
                    const multiRollArray = outcome.rolled.map(thisRoll => `\`${thisRoll.join(', ')}\``);
                    rollResultsText = multiRollArray.join('  /  ');

                } else {
                    // is array of not arrays (one die)
                    rollResultsText = `\`${outcome.rolled.join(', ')}\``;
                }

                output += `${player.displayName} does ${rollResultsText} = **${outcome.result}** damage to the runner, leaving it with **${runnerHP}** HP.\n`;
            }
            output += '\n';

        }

        if (runnerHP <= 0)
            output += stripIndents`
                :tada: **${player.displayName} has defeated the runner!** :tada:

                ${player.displayName} ends the fight with ${playerHP()} **HP**.
            `;
        else {
            stats.currentHP = 1;
            output += '\n';
            output += stripIndents`
                <:zombie:599093779395248138> **Unfortunately, the runner has defeated ${player.displayName}!** <:zombie:599093779395248138>

                ${player.displayName} stumbles home empty handed, and their HP is set to ${playerHP()}.
            `;
        }

        await this.mod.setPlayerStats(msg.guild, player.id, stats);
        await send(msg.channel, output);
    }
};
// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Rolls runner damage'],
    ['<player>', 'Rolls a random encounter between a runner and a player.']
]);

exports.config = {
    name: 'Runner Attacks',
    cmd: 'runner',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Rolls a random encounter between a player and a Runner.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
