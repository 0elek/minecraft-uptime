import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("get a random number between ranges")
    .addIntegerOption(option => option.setName('min')
    .setDescription('The minimum number').setRequired(true))
    .addIntegerOption(option => option.setName('max')
    .setDescription('The maximum number').setRequired(true)),
  async execute(interaction: any, client: any, settings: any) {
    const min = interaction.options.getInteger('min');
    const max = interaction.options.getInteger('max');

    if (min > max) {
      interaction.reply({ content: `The minimum number must be less than the maximum number.`});
      return;
    }

    let random = Math.floor(Math.random() * (max - min + 1)) + min;
    interaction.reply({ content: `Your random number is ${random}`});

  },
};
