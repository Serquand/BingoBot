const sequelize = require("../models/Connection")

module.exports = {
    name: "list_winner",
    description: "Get the list of winner",

    runSlash: async (client, interaction) => {
        const userRole = interaction.member.roles.member._roles;

        if(!userRole.includes(process.env.STAFF_ROLE_ID)) {
            return interaction.reply({
                content: "Vous n'avez pas les permissions pour l'utilisation de cette commande",
                ephemeral: true
            });
        }

        const listWinner = (await sequelize.query(`
            SELECT discordId from Users WHERE winAt <> "0" ORDER BY winAt ASC LIMIT 10;
        `))[0];

        if(listWinner.length == 0) {
            return interaction.reply({
                content: "Il n'y a aucun gagnant !",
                ephemeral: true
            });
        }

        for(let i = 0; i< listWinner.length; i++) listWinner[i] = listWinner[i].dataValues.discordId;

        return interaction.reply({
            content: "Voici la liste des gagnants :\n<@" + listWinner.join(">\n<@") + ">",
            ephemeral: true
        })
    }
}