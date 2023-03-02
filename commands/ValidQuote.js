const Op = require("sequelize").Op;
const Quote = require("../models/Quote");

module.exports = {
    name: "valid_quote",
    description: "Valid a quotation",
    options: [
        {
            name: "quote",
            description: "Citation à valider",
            type: "STRING",
            required: true,
            autocomplete: true,
        }
    ],
    runSlash: async (client, interaction) => {
        interaction.reply("Nous travaillons là-dessus !");
        console.log(interaction.options.getString("quote"));
    }
}