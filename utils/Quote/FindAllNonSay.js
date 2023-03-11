const Quote = require("../../models/Quote");

const findAllNonSay = async () => {
    const allNonSay = new Array(0);

    const quote = await Quote.findAll({ where: { at: "0" } });
    for (const q of quote) allNonSay.push(q.dataValues.sentence);

    console.log(allNonSay);

    return allNonSay;
}

module.exports = findAllNonSay;