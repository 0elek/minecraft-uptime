import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder, Embed } from "discord.js";
import PlayerBuilder from "../util/player";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Get a minecraft Accounts profile")
    // .addStringOption(uuid =>
    //   uuid.setName("uuid")
    //     .setDescription("The uuid of the player")
    //     .setRequired(false)
    // )
    .addStringOption(name =>
      name.setRequired(false)
        .setName("username")
        .setDescription("Username of the player")
        .setRequired(true)
        .setMaxLength(16)
        .setMinLength(1)
    ),
  execute: async (interaction: CommandInteraction, client: any) => {

    const input: string = interaction.options.get("username")?.value as string
    const { name, uuid } = await get_uuid(input)
    if (uuid == "404") {
      interaction.reply("No such account")
      return
    }
    const { skin, cape } = await get_skins(uuid);
    const optifine_cape = await get_optifine_cape(name);
    const minecraftcapes_cape = await get_minecraftcapes_cape(uuid);
    let embed = PlayerBuilder(name, uuid, skin, cape, optifine_cape, minecraftcapes_cape)

    interaction.reply({ embeds: [embed] })
  },
};

async function get_uuid(name: string) {
  let res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`)
  let text = JSON.parse(await res.text())
  if (res.status == 404) return { uuid: "404", name: "404" }

  return { uuid: text.id, name: text.name }
}

async function get_skins(uuid: string) {
  let res = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
  if (res.status != 200) return { skin: undefined, cape: undefined }
  let text = JSON.parse(await res.text());

  let json = JSON.parse(atob(text.properties[0].value));

  return { skin: json.textures.SKIN.url, cape: json.textures?.CAPE?.url }
}

async function get_optifine_cape(name: string) {
  let res = await fetch(`http://s.optifine.net/capes/${name}.png`);
  if (res.status != 200) return undefined

  return res.url
}

async function get_minecraftcapes_cape(uuid: string) {
  const link = `https://api.minecraftcapes.net/profile/${uuid}`
  let res = await fetch(link)
  if (res.status != 200) return undefined
  let text = JSON.parse(await res.text());

  if (text.textures.cape != null) {
    return link + "/cape"
  }
}