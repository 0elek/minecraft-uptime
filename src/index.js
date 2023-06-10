const { REST } = require("@discordjs/rest"); 
const { Routes } = require("discord-api-types/v9"); 
const fs = require("fs");
const { Client, Collection } = require("discord.js"); 
const { GatewayIntentBits } = require("discord.js");
const { status } = require('minecraft-server-util');

let settings = fs.readFileSync("./settings.json")
settings = JSON.parse(settings)
let alert = new Object()


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
}); // Connect to our discord bot.
const commands = new Collection(); 
const commandarray = [];
client.once("ready", () => {

  client.channels.fetch(settings.discord.channels.alert.id)
    .then(channel => {
      alert = channel;
      console.log(`Alert channel set to ${alert.name}`);
    })
    .catch(console.error);

  const commandFiles = fs
    .readdirSync("src/Commands")
    .filter(x => x.endsWith(".js"))
  // Loop through the command files
  for (const file of commandFiles) {
    const command = require(`./Commands/${file}`); // Get and define the command file.
    commands.set(command.data.name, command); // Set the command name and file for handler to use.
    commandarray.push(command.data.toJSON()); // Push the command data to an array (for sending to the API).
  }
  const rest = new REST({ version: "9" }).setToken(settings.discord.token); // Define "rest" for use in registering commands
  // Register slash commands.
  ; (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commandarray,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
  console.log(`Logged in as ${client.user.tag}!`);
});
// Command handler.
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client, settings);
  } catch (error) {
    console.error(error);
    return interaction.reply({
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
    // Ping the server

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
          alert.send(message)
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
    //console.log( failedPings, serverOnline, online )
    if (failedPings >= 3 && !serverOnline) {
      const message = `The Minecraft server at ${settings.server.address}:${settings.server.port} is not responding. :(`;
      alert.send(message)
      serverOnline = false;
    }
  } catch (error) {
    //console.error(error);
    serverOnline = false;
  }
}

setInterval(checkServerStatus, 10000);

let oldIP = ""
let ipNow = ""
async function ipChange() {
  let response = await fetch("https://api.ipify.org/").catch(console.error)
  ipNow = await response.text().catch(console.error)
  if (ipNow != oldIP && oldIP != "" && ipNow != "") {
    console.log(ipNow)
    console.log(oldIP)
    oldIP = ipNow
    if(settings.server.channels.aler.ipSafe) alert.send("IP ADDRES CHANGED ", ipNow, " change It in tcpshield!!")
    else{
      console.log("ipNow: ", ipNow)
      alert.send("IP ADDRES CHANGED see the ip in console or change It in tcpshield!!")}
  }
}

if (settings.onHost) {
  setInterval(() => {
    ipChange()
  }, 30000)
}
client.login(settings.discord.token);
