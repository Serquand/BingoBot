const sequelize = require("./Connection");
const { DataTypes } = require("sequelize");
const User = require("./User");
const Quote = require("./Quote");

module.exports = sequelize.define("SubmittingQuote", {
    idSubmitting: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true, 
    },

    at: {
        type: DataTypes.STRING(22),
        defaultValue: "0"
    },          

    by: {
        type: DataTypes.STRING(22),
        references: {
            model: User, 
            key: "discordId"
        }
    },

    quote: {
        type: DataTypes.INTEGER, 
        references: {
            model: Quote, 
            key: "quoteId"
        }
    }
}, {
    timestamps: false
});