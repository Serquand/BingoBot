const sequelize = require("../../models/Connection");

const findMineNonSay = async (discordId) => {
    const allMineNonSay = new Array(0);
    
    const res = (await sequelize.query(`
        SELECT sentence FROM Quotes Q, Users U, SentenceInGrids S
        WHERE U.discordId = :discordId
        AND U.gridNumber = S.idGrid 
        AND S.idQuote = q.quoteId
    `, { replacements: { discordId } }))[0];
    for (const quote of res) allMineNonSay.push(quote.sentence);
    console.log(allMineNonSay);

    return allMineNonSay;
}

module.exports = findMineNonSay;