const { Op } = require("sequelize");
const sequelize = require("../models/Connection");
const Quote = require("../models/Quote");
const SentenceInGrid = require("../models/SentenceInGrid");

module.exports = {
    name: "submit_quote",
    description: "Submit a quotation",
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
        // Récupère la citation
        const quote = interaction.options.getString("quote");
        const discordId = interaction.user.id;

        // Check si l'utilisateur a cette citation dans la grille
        const res = (await sequelize.query(`
            SELECT COUNT(*) AS c FROM Quotes AS q, SentenceInGrids AS s, Users AS u
            WHERE q.sentence = :quote 
            AND s.idQuote = q.quoteId 
            AND s.idGrid = u.gridNumber
            AND u.discordId = :discordId
        `, { replacements: { quote, discordId } }))[0][0].c
        if(res == 0) { // Si il ne l'a pas, renvoie un message d'erreur
            interaction.reply({
                content: "Cette citation n'est pas sur votre grille !",
                ephemeral: true
            });
            return;
        }
        
        // Check si la citation est validée
        const resValidation = (await Quote.findOne({
            where: { sentence: quote }
        })).dataValues.at
        
        // Si elle n'est pas validé, renvoie un message d'erreur
        if(resValidation == "0") {
            interaction.reply({
                content: "La citation n'est pas validée !",
                ephemeral: true
            })
            return;
        } 
        
        // Valide la citation
        await sequelize.query(`
            UPDATE SentenceInGrids AS S 
            INNER JOIN Quotes ON Quotes.quoteId = SentenceInGrids.idQuote
            INNER JOIN Users ON Users.gridNumber = SentenceInGrids.idGrid
            SET isValidAt = :ts 
            WHERE Quotes.sentence = :quote 
            AND Users.discordId = :discordId
        `, { replacements: { quote, ts: Date.now().toString(), discordId } });


        // Récupère la liste des citations restantes dans la grille
        const quoteStillAlive = await sequelize.query(`
            SELECT sentence FROM Users U, SentenceInGrid S
            WHERE U.discordId = :discordId 
            AND U.gridNumber = S.idGrid 
            AND S.isValidAt <> "0"
        `)[0];

        console.log(quoteStillAlive);

        // Si il ne reste plus aucune citation, envoie un message de félicitations.
        if(quoteStillAlive.length == 0) {
            return interaction.reply({
                content: "Bravo ! Vous avez gagné !", 
                ephemeral: true
            })
        }

        for (const k in quoteStillAlive) {
            console.log(k);
            quoteStillAlive[k] = quoteStillAlive[k].sentence
        }

        // Renvoie un message d'information
        return interaction.reply({
            content: quoteStillAlive.join("\n"),
            ephemeral: true
        })
    }
}