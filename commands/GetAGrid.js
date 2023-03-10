const User = require("../models/User");
const SentenceInGrid = require("../models/SentenceInGrid");
const informations = require("../informations.json");
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
        console.log(grids);
        await User.create({ discordId, gridNumber: numberGridsSelected });

        const gridSentences = new Array(0);
        for(let i = 0; i < informations.numberRefPerGrid; i++) {
            console.log(i);
            gridSentences.push({
                idGrid: numberGridsSelected, 
                idQuote: informations.refs.indexOf(grids[i]) + 1
            })
        }   
        SentenceInGrid.bulkCreate(gridSentences);

        // Submit the grid to the user
        interaction.reply({ content: submitGridMessage(grids), ephemeral: true })
    }
}