import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("ip")
  .setDescription("Get ip address of the Minecraft server");
export async function execute(interaction: { reply: (arg0: { content: any; }) => any; },client : any, settings: { server: { address: any; }; }) {
  return interaction.reply({ content: settings.server.address });
}
// i think this should check the ipsafe
// no because ipsafe is for server ip not proxy.