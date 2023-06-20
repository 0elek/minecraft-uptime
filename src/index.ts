import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { status } from 'minecraft-server-util';
import settings from "./util/settings";

let alert_channel: any = new Object();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const commands = new Collection();
const commandarray: Array<JSON> = [];
client.once("ready", () => {

  client.channels.fetch(settings.discord.channels.alert.id)
    .then(channel => {
      if (!channel) {
        console.log("Alert channel not found.");
        process.exit(1);
      }
      alert_channel = channel;
      console.log(`Alert channel set to ${alert_channel.name}`);
    })
    .catch(console.error);

  const commandFiles = fs
    .readdirSync("src/Commands")
    .filter(x => x.endsWith(".cjs"))


  for (const file of commandFiles) {
    const command: any = require(`./Commands/${file}`);
    commands.set(command.data.name, command);
    commandarray.push(command.data.toJSON());
  }
  const rest = new REST({ version: "9" }).setToken(settings.discord.token); // Define "rest" for use in registering commands
  // Register slash commands.
  ; (async () => {
    try {
      console.log("Started refreshing application (/) commands.");


      if (client.user === null) {
        console.log("Client user is null, exiting.");
        process.exit(1);
      }

      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commandarray,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
  console.log(`Logged in as ${client?.user?.tag}!`);
});
// Command handler.


client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;
  const command: any = commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client, settings);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});




let failedPings = 0;
let serverOnline = false;
let first = true
async function checkServerStatus() {
  try {

    let online = new Boolean()
    const SVRstatus = await status(settings.server.address).catch((e) => {
      online = false
    })
    if (SVRstatus?.roundTripLatency) {
      online = true
    }
    if (online) {
      if (!serverOnline) {
        if (!first) {
          const message = `The Minecraft server at ${settings.server.address}:${settings.server.port} is now back online. :) `;
          alert_channel.send(message)
        }
      }
      failedPings = 0;
      serverOnline = true;
    }
    else {
      failedPings++;
      serverOnline = false;
    }
    first = false
    if (failedPings >= 3 && !serverOnline) {
      const message = `The Minecraft server at ${settings.server.address}:${settings.server.port} is not responding. :(`;
      alert_channel.send(message)
      serverOnline = false;
    }
  } catch (error) {
    serverOnline = false;
  }
}

setInterval(checkServerStatus, 10000);

let oldIP = ""
let ipNow = ""
async function ipChange() {
  let response: void | Response = await fetch("https://api.ipify.org/").catch(console.error)
  if (!response) return
  ipNow = await response.text()
  if (ipNow != oldIP && oldIP != "" && ipNow != "") {
    // console.log(ipNow)
    // console.log(oldIP)
    oldIP = ipNow

    alert_channel.send(`The IP address of the Minecraft server has changed ${settings.discord.channels.alert.ipSafe ? ` now : ${ipNow} old : ${oldIP}` : ``}, update it.`)
  }
}

if (settings.onHost) {
  setInterval(() => {
    ipChange()
  }, 30000)
}

client.login(settings.discord.token);
