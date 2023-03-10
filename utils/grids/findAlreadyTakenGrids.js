const sequelize = require("../../models/Connection");
const informations = require("../../informations.json");

const fetchAllSelectedGridFromDb = async () => {
    const res = (await sequelize.query(`
        SELECT sentence 
        FROM Quotes AS q, SentenceInGrids AS s 
        WHERE q.quoteId = s.idQuote 
        ORDER BY s.idGrid ASC;
    `))[0]; 

    return res;
}

const groupByGrid = (data) => {
    const grids = new Array(0);
    for(let i = 0; i < data.length / informations.numberRefPerGrid; i++) {
        const temp = new Array(0);
        for(let j = 0; j < informations.numberRefPerGrid; j++) {
            temp.push(data[informations.numberRefPerGrid * i + j].sentence);
        }
        grids.push(temp)
    }

    return grids;
}

const findAlreadyTakenGrids = async (takenGrids, allGrids) => {
    const informations = groupByGrid(await fetchAllSelectedGridFromDb());
    for(let i = 0; i < allGrids.length; i++) {
        const data = allGrids[i].join();
        for(let j = 0; j < informations.length; j++) {
            if(data == informations[j].join()) {
                takenGrids.push(i);
                break;
            }
        }
    }
}

module.exports = findAlreadyTakenGrids;