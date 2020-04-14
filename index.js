require("dotenv").config();
const Discord = require("discord.js");
const betterSqlite = require("better-sqlite3");
const config = require("./config.json");

const client = new Discord.Client({ disableMentions: "all" });

/**
 * @type {import("better-sqlite3").Database}
 */
let database = null;

client.on("ready", async () =>
{
	console.log(`Ready and logged in as ${client.user.username}`);

	if (database === null)
	{
		database = betterSqlite("./leveling.db");
		createTableIfNotExists();
	}
});

client.on("message", async (message) =>
{
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;

	addXp(message).catch(console.error);

	if (!message.content.startsWith(process.env.PREFIX)) return;

	const args = message.content.slice(process.env.PREFIX.length).split(/ +/g);
	const command = args.shift();

	// TODO: Make command handler.
	switch (command)
	{
		case "help": {
			await message.channel.send("**Commands**\nhelp, level");
			break;
		}

		case "level": {
			// show level and xp
			break;
		}

		case "logout":
		case "disconnect": {
			if (config.ownerIDs.includes(message.author.id))
			{
				client.destroy();
				process.exit();
			}
			break;
		}
	} // END SWITCH
}); // END <Client>.on("message", ...);

/**
 * @param {Discord.Message} message
 */
function addXp(message)
{
	const data = database.prepare("SELECT xp FROM levelup WHERE user_id = ?").get(message.author.id);
	console.debug(data);
	// if not found, insert into db, otherwise update
}

function createTableIfNotExists()
{
	database.exec("CREATE TABLE IF NOT EXISTS levelup (user_id TEXT PRIMARY KEY UNIQUE, xp)");
}

client.login(process.env.TOKEN);

/**
 * database.getUser(id)
 * database.
 */