const User = require("../models/User");
const submitGridMessage = require("../utils/Message/SubmitGrid");

module.exports = {
    name: "get_a_grid",
    description: "Ask for a grid. Words only once by user.",
    runSlash: async (client, interaction) => {
        const discordId = interaction.user.id;

        // Check if the user has a grid
        const res = await User.findOne({ where: { discordId } })
        if(res != null) {
            return interaction.reply({
                content: "Vous ne pouvez avoir qu'une seule grille !",
                ephemeral: true
            })
        };

        // Get the numbers of grid already selected
        const numberGridsSelected = (await User.findAll()).length;

        // Assign the grid to the user 
        const grids = client.allGrids[numberGridsSelected];
        User.create({ discordId, gridNumber: numberGridsSelected });

        // Submit the grid to the user
        interaction.reply({ content: submitGridMessage(grids), ephemeral: true })
    }
}