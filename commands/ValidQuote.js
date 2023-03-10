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
        const userRole = interaction.member.roles.member._roles;
        const sentence = interaction.options.get("quote").value;

        if(!userRole.includes(process.env.STAFF_ROLE_ID)) {
            return interaction.reply({
                content: "Vous n'avez pas les permissions pour l'utilisation de cette commande",
                ephemeral: true
            });
        }

        const res = await Quote.update(
            { at: Date.now() },
            { where: { sentence } }
        );

        if(res[0] == 0) {
            return interaction.reply({
                content: "Aucune citation n'a pu être trouvée !",
                ephemeral: true
            })
        } else {
            return interaction.reply({
                content: "La citation a bien été modifiée !",
                ephemeral: true
            })
        }
    }
}