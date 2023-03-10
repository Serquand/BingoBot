const sequelize = require("./Connection");
const { DataTypes } = require("sequelize");
const User = require("./User");
const Quote = require("./Quote");

const SentenceInGrid = sequelize.define("SentenceInGrid", {
    idSentenceInGrid: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true,   
        autoIncrement: true,  
    }, 

    idGrid: {
        type: DataTypes.INTEGER,
        references: {
            model: User, 
            key: "gridNumber"
        }
    },

    idQuote: {
        type: DataTypes.INTEGER, 
        references: {
            model: Quote, 
            key: "quoteId"
        }
    },

    validity: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    }, 

    isValidAt: {
        type: DataTypes.STRING(22),
        default: "0"
    }
}, { timestamps: false })

module.exports = SentenceInGrid;