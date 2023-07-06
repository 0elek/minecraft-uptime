import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("get a random number between ranges")
    .addIntegerOption(option => option.setName('min')
    .setDescription('The minimum number').setRequired(true))
    .addIntegerOption(option => option.setName('max')
    .setDescription('The maximum number').setRequired(true)),
  execute: async (interaction: { reply: (arg0: { content: string; }) => any; }) => {
    let min = interaction.reply.arguments.getInteger('min');
    let max = interaction.reply.arguments.getInteger('max');
    let random = Math.floor(Math.random() * (max - min + 1)) + min;
    return interaction.reply({ content: `Your random number is ${random}` });
  },
};
