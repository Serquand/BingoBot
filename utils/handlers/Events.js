const promisify = require("util").promisify;
const glob = require("glob");
const chalk = require("chalk");

const pGlob = promisify(glob);

const eventHandler = async (client) => {   
    (await pGlob(`${process.cwd()}/events/*.js`)).map(async (eventFile) => {
        const event = require(eventFile);

        console.log(chalk.yellow('Evenement chargée : ' + event.name));

        if(event.once == true) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    })
}

module.exports = eventHandler;