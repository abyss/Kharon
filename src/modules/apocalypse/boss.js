const { send, findUser, roll } = require('../../includes/helpers');
const { stripIndents } = require('common-tags');

const bossDmgRoll = '4d8';
const bossMaxHP = 30;

exports.run = async (msg, args) => {
    let bossHP = bossMaxHP;


    if (args.length === 0){

        const result = roll(bossDmgRoll).total;
        send(msg.channel, `The Boss rolls ${bossDmgRoll} and attacks for: **${result}** damage.`);

    } else if (args[0] === 'hp') {
        send(msg.channel, `**boss HP:** \`${bossMaxHP}\``);
    } else {
        const player = findUser(msg.guild, args[0]);
        if (!player) return send(msg.channel, '404 Player not found.');

        const stats = await this.mod.getPlayerStats(msg.guild, player.id);
        if (!stats) return send(msg.channel, `${player.displayName} is not a player.`);

        const playerHP = () => `**${stats.currentHP}/${stats.maxHP}**`;

        let output = '';
        while(stats.currentHP > 0 && bossHP > 0) {
            // boss Attacks!
            let bossDamage = roll(bossDmgRoll).total;
            let armourReduction = 0;
            if (stats.armour) armourReduction = roll(stats.armour).total;

            let result = Math.max(0, bossDamage-armourReduction);

            stats.currentHP -= result;
            if (armourReduction) output += `The Boss does \`${bossDamage}-${armourReduction}\` = **${result}** damage to ${player.displayName}, leaving them with ${playerHP()} HP.\n`;
            else output += `The Boss does **${result}** damage to ${player.displayName}, leaving them with ${playerHP()} HP.\n`;

            if (stats.currentHP <= 0) break;

            // Player Attacks!
            for (let i = 0; i < stats.attacks; i++) {
                let outcome = roll(stats.damage);
                bossHP -= outcome.total;

                let rollResultsText;
                if (Array.isArray(outcome.dice[0])) {
                    // is array of arrays (multiple dice)
                    const multiRollArray = outcome.dice.map(thisRoll => `\`${thisRoll.join(', ')}\``);
                    rollResultsText = multiRollArray.join('  /  ');

                } else {
                    // is array of not arrays (one die)
                    rollResultsText = `\`${outcome.dice.join(', ')}\``;
                }

                output += `${player.displayName} does ${rollResultsText} = **${outcome.total}** damage to the boss, leaving it with **${bossHP}** HP.\n`;
            }
            output += '\n';

        }

        if (bossHP <= 0)
            output += stripIndents`
                :tada: **${player.displayName} has defeated the Boss!** :tada:

                ${player.displayName} ends the fight with ${playerHP()} **HP**.
            `;
        else {
            stats.currentHP = 1;
            output += '\n';
            output += stripIndents`
                <:zombie:599093779395248138> **Unfortunately, the Boss has defeated ${player.displayName}!** <:zombie:599093779395248138>

                ${player.displayName} stumbles home empty handed, and their HP is set to ${playerHP()}.
            `;
        }

        await this.mod.setPlayerStats(msg.guild, player.id, stats);
        await send(msg.channel, output);
    }
};
// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Rolls Boss damage'],
    ['<player>', 'Rolls a random encounter between a Boss and a player.']
]);

exports.config = {
    name: 'Boss Attacks',
    cmd: 'boss',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Rolls a random encounter between a player and a Boss.',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
