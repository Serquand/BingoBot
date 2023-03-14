const { Op } = require("sequelize");
const sequelize = require("../models/Connection");
const Quote = require("../models/Quote");
const SentenceInGrid = require("../models/SentenceInGrid");
const User = require("../models/User");

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
        console.log(interaction.user.username + " asks for submitting a quote !");
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
            await interaction.reply({
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
            return await interaction.reply({
                content: "La citation n'est pas validée !",
                ephemeral: true
            })
        } 

        // Check si le joueur a déjà validé la citation
        const isAlreadySubmitted = (await sequelize.query(`
            SELECT COUNT(*) AS c FROM SentenceInGrids S, Users U, Quotes Q 
            WHERE 
                s.idQuote = q.quoteId AND   
                s.idGrid = u.gridNumber AND
                q.sentence = :quote AND
                u.discordId = :discordId AND
                (S.isValidAt IS NULL OR S.isValidAt = "0")
        `, { replacements: { discordId, quote } }))[0][0].c;

        if(isAlreadySubmitted == 0) {
            return await interaction.reply({
                content: "Vous avez déjà validé cette citation",
                ephemeral: true
            })
        }   
        
        // Valide la citation
        const idSentenceInGrid = (await sequelize.query(`
            SELECT idSentenceInGrid 
            FROM SentenceInGrids AS s, Quotes AS q, Users AS u
            WHERE 
                s.idQuote = q.quoteId AND   
                s.idGrid = u.gridNumber AND
                q.sentence = :quote AND
                u.discordId = :discordId
        `, { replacements: { quote, discordId } }))[0][0].idSentenceInGrid;

        await SentenceInGrid.update(
            { isValidAt: Date.now() }, 
            { where: { idSentenceInGrid } }
        )

        // Récupère la liste des citations restantes dans la grille
        const quoteStillAlive = (await sequelize.query(`
            SELECT sentence FROM Users U, SentenceInGrids S, Quotes q
            WHERE U.discordId = :discordId 
            AND U.gridNumber = S.idGrid 
            AND (S.isValidAt IS NULL OR S.isValidAt = "0")
            AND S.idQuote = q.quoteId
        `, { replacements: { discordId } }))[0];

        // Si il ne reste plus aucune citation, envoie un message de félicitations et change l'heure de la grille.
        if(quoteStillAlive.length == 0) {
            User.update({ winAt: Date.now() }, { where: { discordId }});
            
            return await interaction.reply({
                content: "Bravo ! Vous avez gagné !", 
                ephemeral: true
            });
        }

        for (const k in quoteStillAlive) quoteStillAlive[k] = quoteStillAlive[k].sentence

        // Renvoie un message d'information
        return await interaction.reply({
            content: "Bravo, vous avez validé cette citation ! Il vous reste : \n" + quoteStillAlive.join("\n"),
            ephemeral: true
        })
    }
}