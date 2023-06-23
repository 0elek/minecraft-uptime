import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uuid")
    .setDescription("Convert UUID to minecaft name.")
    .addStringOption(uuid =>
      uuid.setName("uuid")
        .setDescription("The uuid of the player")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction, client: any) => {
    let uuid: string = interaction.options.get("uuid")?.value as string

    if (uuid.length != 36 && uuid.length != 32) {
      interaction.reply("invaild UUID "+ uuid.length)
      return
    }else {
 
      let res = fetch(`https://api.mojang.com/user/profile/${uuid}`)
      let x = (await res).text()
      interaction.channel?.send(await x)
    }
  },
};
