const Quote = require("../models/Quote");

module.exports = {
    name: "list",
    description: "List all citation and their status",
    runSlash: async (client, interaction) => {
        const allQuotes = await Quote.findAll({
            attributes: ["sentence", "at"]
        });

        const passedQuote = new Array(0), stilledQuote = new Array(0);

        for(let i = 0; i < allQuotes.length; i++) {
            if(allQuotes[i].dataValues.at != "0") passedQuote.push(allQuotes[i].dataValues.sentence);
            else stilledQuote.push(allQuotes[i].dataValues.sentence);
        }

        return interaction.reply({
            content: "**Liste des citations validées :**\n" + passedQuote.join("\n") + "\n\n**Liste des citations non validées :**\n" + stilledQuote.join("\n"),
            ephemeral: true
        })
    }
}