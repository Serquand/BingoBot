require("dotenv").config();
const { Collection, Client } = require("discord.js");
const setup = require("./models/Setup");
const commandHandlers = require("./utils/handlers/Commands");
const eventHandlers = require("./utils/handlers/Events");

const client = new Client({ intents: 3276799 });
client.commands = new Collection();
client.login(process.env.TOKEN);

console.clear();

const main = async () => {
    await commandHandlers(client);
    await eventHandlers(client);
    await setup();
}

main();