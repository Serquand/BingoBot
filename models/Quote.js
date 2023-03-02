const sequelize = require("./Connection");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("Quote", {
    quoteId: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        allowNull: false,
        primaryKey: true
    },
    at: {
        type: DataTypes.STRING(20),
        defaultValue: "0"
    },
    sentence: {
        type: DataTypes.TEXT("medium"), 
        allowNull: false
    }
}, {
    timestamp: false
});