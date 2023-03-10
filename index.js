require("dotenv").config();
const { Collection, Client } = require("discord.js");
const setup = require("./models/Setup");
const commandHandlers = require("./utils/handlers/Commands");
const eventHandlers = require("./utils/handlers/Events");
const informations = require("./informations.json");
const generateGrids = require("./utils/grids/generateGrids");
const findAlreadyTakenGrids = require("./utils/grids/findAlreadyTakenGrids");

const client = new Client({ intents: 3276799 });
client.commands = new Collection();
client.login(process.env.TOKEN);
client.allGrids = new Array(0);
client.numberAlreadyTaken = new Array(0);

console.clear();

const main = async () => {
    await commandHandlers(client);
    await eventHandlers(client);
    await setup();
    generateGrids(informations.refs, informations.numberRefPerGrid, 0, client);
    findAlreadyTakenGrids(client.numberAlreadyTaken);
}

main();