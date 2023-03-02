const Sequelize = require('sequelize')

module.exports = new Sequelize(process.env.DB_Name, process.env.DB_User, process.env.DB_Pwd, {
    host: process.env.DB_Host,
    dialect: process.env.DB_Dialect,
    logging: true
})