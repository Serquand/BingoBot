const chalk = require('chalk')

module.exports = {
    name: "ready", 
    once: true, 
    async execute (client) {
        console.log(chalk.cyan("Bot launched !"));

        const devGuild = client.guilds.cache.get(process.env.idServ);
        devGuild?.commands.set(client.commands.map((cmd) => cmd))
    }
}