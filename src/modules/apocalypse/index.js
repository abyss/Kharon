const Module = require('../../includes/module-class');

module.exports = class ApocalypseModule extends Module {
    // Module commands go here

    async setPlayerRole(guild, roleId) {
        await this.bot.db.set(guild, 'playerRole', roleId);
    }

    async getPlayerRole(guild) {
        return await this.bot.db.get(guild, 'playerRole');
    }

    async setModRole(guild, roleId) {
        await this.bot.db.set(guild, 'modRole', roleId);
    }

    async getModRole(guild) {
        return await this.bot.db.get(guild, 'modRole');
    }

    async setWave(guild, wave) {
        await this.bot.db.set(guild, 'wave', wave);
    }

    async getWave(guild) {
        return await this.bot.db.get(guild, 'wave');
    }

    async getBase(guild) {
        let base = await this.bot.db.get(guild, 'base');
        if (!base) base = {
            currentHP: 150,
            maxHP: 150
        };
        return base;
    }

    async getBaseHP(guild) {
        return await this.bot.db.get(guild, 'base.currentHP');
    }

    async getBaseMaxHP(guild) {
        return await this.bot.db.get(guild, 'base.maxHP');
    }

    async setBaseHP(guild, baseCurrentHP) {
        await this.bot.db.set(guild, 'base.currentHP', baseCurrentHP);
    }

    async setBaseMaxHP(guild, baseMaxHP) {
        await this.bot.db.set(guild, 'base.maxHP', baseMaxHP);
    }

    async getPlayers(guild) {
        return await this.bot.db.get(guild, 'players');
    }

    async getPlayerStats(guild, id) {
        return await this.bot.db.get(guild, `players.${id}`);
    }

    async setPlayerStats(guild, id, stats) {
        await this.bot.db.set(guild, `players.${id}`, stats);
    }

    async delPlayer(guild, id) {
        await this.bot.db.delete(guild, `players.${id}`);
    }

    get config() {
        return {
            name: 'Apocalypse',
            description: 'Commands for B&C Zombie Apocalypse!.... or something',
            debug: false // This makes it unusable to anyone besides process.env.OWNER
        };
    }
};
