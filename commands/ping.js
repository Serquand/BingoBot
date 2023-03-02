module.exports = {
    name: "ping",
    description: "Test the connection",
    runSlash: (client, interaction) => {
        interaction.reply("Pong");
    }
}