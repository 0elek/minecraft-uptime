import { SlashCommandBuilder } from "@discordjs/builders";


module.exports = {
  data: new SlashCommandBuilder()
    .setName("uuid")
    .setDescription("Convert UUID to minecaft name."),
  execute: async (interaction: { reply: (arg0: { content: string; }) => any; }, client: any) => {
  	console.log(interaction)
	// let res = await fetch(`https://api.mojang.com/user/profile/${interaction.arg0}`)
	// return interaction.reply({ content: `${JSON.parse(res).name}` });
  },
};
