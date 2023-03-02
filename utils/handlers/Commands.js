const promisify = require("util").promisify;
const glob = require("glob");
const chalk = require("chalk");

const pGlob = promisify(glob);

const commandHandlers = async (client) => {
    (await pGlob(`${process.cwd()}/commands/*.js`)).map(async cmdFile => {
        const cmd = require(cmdFile);

        if(!cmd.name || !cmd.description) {
            return console.log(chalk.red("------\nCommande pas chargée : Pas de description ou de nom\n------"))
        }
        
        client.commands.set(cmd.name, cmd);
        console.log(chalk.magenta("Commande chargée : ", cmd.name));
    })   
}

module.exports = commandHandlers;