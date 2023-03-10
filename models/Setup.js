const Quote = require("./Quote");
const User = require("./User");
const informations = require("../informations.json");
const SentenceInGrid = require("./SentenceInGrid");

const force = process.env.resetDB == "yes" ? true : false;

const fillQuotes = () => {
    const quotes = new Array(0); 
    for(const ref of informations.refs) {
        quotes.push({ sentence: ref });
    }
    Quote.bulkCreate(quotes)
}

const setup = async () => {
    if(!force) return;
    await Quote.sync({ force });
    await User.sync({ force });
    await SentenceInGrid.sync({ force });
    fillQuotes();
}

module.exports = setup;