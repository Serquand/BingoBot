const findAllNonSay = require('../utils/Quote/FindAllNonSay');
const findMineNonSay = require("../utils/Quote/findMineNonSay");

module.exports = {
    name: "interactionCreate", 
    once: false, 
    async execute(client, interaction) {
        if(interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if(!cmd) return interaction.reply("Cette commande n'existe pas");
            cmd.runSlash(client, interaction);
        }

        if(interaction.isAutocomplete()) {
            const content = interaction.options.getFocused();
            let allQuotes;

            switch(interaction.commandName) {
                case "submit_quote":
                    allQuotes = await findMineNonSay(interaction.user.id);
                    break;
                
                case  "valid_quote":
                    allQuotes = await findAllNonSay();  
                    break;
                
                default: 
                    return;
            }

            allQuotes = allQuotes.filter(q => {
                return q.toLowerCase().includes(content.toLowerCase())
            }).slice(0, 6);

            await interaction.respond(allQuotes.map(allQuotes => ({ name: allQuotes, value: allQuotes }))); 
        }

        const devGuild = await client.guilds.cache.get(process.env.idServ);
        devGuild.commands.set(client.commands.map(cmd => cmd))
    }
}