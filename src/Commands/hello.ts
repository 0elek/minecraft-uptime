import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say Hello To me!"),
  execute: async (interaction: { reply: (arg0: { content: string; }) => any; }, client: any) => {
    return interaction.reply({ content: "Blazing! 🚅" });
  },
};
