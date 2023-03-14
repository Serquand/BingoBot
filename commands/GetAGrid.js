const User = require("../models/User");
const SentenceInGrid = require("../models/SentenceInGrid");
const informations = require("../informations.json");
const submitGridMessage = require("../utils/Message/SubmitGrid");
const findAGoodGridIndex = require("../utils/grids/FindAGoodGridIndex");

module.exports = {
    name: "get_a_grid",
    description: "Ask for a grid. Words only once by user.",
    runSlash: async (client, interaction) => {
        console.log(interaction.user.username + " asks for a new grid !");
        const discordId = interaction.user.id;

        // Check if the user has a grid
        const res = await User.findOne({ where: { discordId } })
        if(res != null) {
            return await interaction.reply({
                content: "Vous ne pouvez avoir qu'une seule grille !",
                ephemeral: true
            })
        };

        // Get the numbers of grid already selected
        const numberGridsSelected = (await User.findAll()).length;

        // Assign the grid to the user 
        const userGridIndex = findAGoodGridIndex(client.allGrids.length, client.numberAlreadyTaken)
        client.numberAlreadyTaken.push(userGridIndex)
        const grids = client.allGrids[userGridIndex];
        await User.create({ discordId, gridNumber: numberGridsSelected });

        // Add the grid in the database
        const gridSentences = new Array(0);
        for(let i = 0; i < informations.numberRefPerGrid; i++) {
            gridSentences.push({ idGrid: numberGridsSelected, idQuote: informations.refs.indexOf(grids[i]) + 1 })
        }   
        SentenceInGrid.bulkCreate(gridSentences);

        // Submit the grid to the user
        return await interaction.reply({ content: submitGridMessage(grids), ephemeral: true })
    }
}