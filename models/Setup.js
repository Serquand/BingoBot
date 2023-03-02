const Quote = require("./Quote");
const User = require("./User");
const informations = require("../informations.json");
const SubmittingQuote = require("./SubmittingQuote");

const force = process.env.resetDB == "yes" ? true : false;

const fillQuotes = () => {
    const quotes = new Array(0); 
    for(const ref of informations.refs) {
        quotes.push({ sentence: ref});
    }
    Quote.bulkCreate(quotes)
}

const setup = async () => {
    await Quote.sync({ force });
    await User.sync({ force });
    await SubmittingQuote.sync({ force });
    if(force) fillQuotes();
}

module.exports = setup;