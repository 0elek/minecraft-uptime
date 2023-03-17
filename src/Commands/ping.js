const { SlashCommandBuilder } = require("@discordjs/builders");
const {status} = require("minecraft-server-util")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bots latency!"),
  execute: async (interaction, client, settings) => {
    let McPing = (await status(settings.server.address)).roundTripLatency
    return interaction.reply({ content: `Pong \`${client.ws.ping}ms\` 🏓\n ${settings.server.address} \`${McPing}ms\`` });
  },
};
