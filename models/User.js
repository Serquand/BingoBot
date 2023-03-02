const sequelize = require("./Connection");
const { DataTypes } = require("sequelize");

module.exports = sequelize.define("User", {
    discordId: {
        type: DataTypes.STRING(22),
        unique: true, 
        allowNull: false,
        primaryKey: true
    },

    gridNumber: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        unique: true, 
    }
}, {
    timestamps: false
});