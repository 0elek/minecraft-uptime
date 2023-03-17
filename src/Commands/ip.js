const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ip")
    .setDescription("Get ip address of the Minecraft servder"),
  execute: async (interaction, client, settings) => {
    return interaction.reply({ content: settings.server.address });
  },
};
