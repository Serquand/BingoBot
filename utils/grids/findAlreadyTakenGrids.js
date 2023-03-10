const sequelize = require("../../models/Connection");

const findAlreadyTakenGrids = async (takenGrids) => {
    const res = (await sequelize.query(`
        SELECT sentence 
        FROM Quotes AS q, SentenceInGrids AS s 
        WHERE q.quoteId = s.idQuote 
        ORDER BY s.idGrid ASC;
    `))[0]; 
    console.log(res);
}

module.exports = findAlreadyTakenGrids;