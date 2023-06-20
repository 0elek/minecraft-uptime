import { SlashCommandBuilder } from "@discordjs/builders";
import { status } from "minecraft-server-util"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bots latency!"),
  execute: async (interaction: { reply: (arg0: { content: string; }) => any; }, client: { ws: { ping: any; }; }, settings: { server: { address: string; }; }) => {
    let McPing = (await status(settings.server.address)).roundTripLatency
    return interaction.reply({ content: `Pong \`${client.ws.ping}ms\` 🏓\n ${settings.server.address} \`${McPing}ms\`` });
  },
};
