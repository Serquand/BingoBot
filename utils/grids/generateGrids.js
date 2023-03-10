const informations = require("../../informations.json");

const allGrids = new Array(0);
const result = [];
result.length = informations.numberRefPerGrid;

function generateGrids(input, len, start, client) {
    if(len === 0) {
        allGrids.push([...result])
        client.allGrids = allGrids;
        return;
    }
    for (let i = start; i <= input.length - len; i++) {
        result[result.length - len] = input[i];
        generateGrids(input, len - 1, i + 1, client);
    }
}

module.exports = generateGrids;