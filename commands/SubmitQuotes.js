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

        // Check si l'utilisateur a cette citation dans la grille
        const res = (await sequelize.query(`
            SELECT COUNT(*) AS c FROM Quotes AS q, SentenceInGrids AS s, Users AS u
            WHERE q.sentence = :quote 
            AND s.idQuote = q.quoteId 
            AND s.idGrid = u.gridNumber
        `, { replacements: { quote } }))[0][0].c
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
            UPDATE SentenceInGrids S SET isValidAt = :ts 
            INNER JOIN Quotes Q ON Q.sentence = :quote 
            AND Q.quoteId = S.idQuote
        `, {
            replacements: {
                quote, 
                ts: Date.now()
            }
        });

        // Si il ne reste plus aucune citation, envoie un message de félicitations.
        

        // Renvoie un message d'information
    }
}