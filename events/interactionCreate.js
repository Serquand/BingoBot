module.exports = {
    name: "interactionCreate", 
    once: false, 
    async execute(client, interaction) {
        if(interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if(!cmd) return interaction.reply("Cette commande n'existe pas");
            cmd.runSlash(client, interaction);
        }

        const devGuild = await client.guilds.cache.get(process.env.idServ);
        devGuild.commands.set(client.commands.map(cmd => cmd))
    }
}