require("dotenv").config();
const Discord = require("discord.js");
const betterSqlite = require("better-sqlite3");
const commands = require("./commands");

const client = new Discord.Client({ disableMentions: "all" });
const statements = {
	selectXp: null,
	insertUser: null,
	updateXp: null
};

/**
 * @type {import("better-sqlite3").Database}
 */
let database = null;

client.on("ready", async () =>
{
	console.log(`Ready and logged in as ${client.user.username}`);

	if (database === null)
	{
		database = betterSqlite("./leveling.db", { verbose: console.log });
		statements.selectXp = database.prepare("SELECT xp FROM levelup WHERE user_id = ?");
		statements.insertUser = database.prepare("INSERT INTO levelup (user_id, xp) VALUES (?, ?)");
		statements.updateXp = database.prepare("UPDATE levelup SET xp = ? WHERE user_id = ?");

		createTableIfNotExists();
	}
});

client.on("message", async (message) =>
{
	try
	{
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;

		addXp(message);

		if (!message.content.startsWith(process.env.PREFIX)) return;

		const args = message.content.slice(process.env.PREFIX.length).split(/ +/g);
		const command = args.shift();
		const cmd = commands.get(command) || commands.find(x => x.aliases.includes(command));

		if (cmd != null) cmd.run(message, args, { statements, database });
	}
	catch (err)
	{
		console.error(err);
	}
});

/**
 * @param {Discord.Message} message
 */
function addXp(message)
{
	let data = statements.selectXp.get(message.author.id);

	if (data == null)
	{
		statements.insertUser.run(message.author.id, 1);
		data = statements.selectXp.get(message.author.id);
	}
	else
	{
		statements.updateXp.run(data.xp + 1, message.author.id);
	}
}

function createTableIfNotExists()
{
	database.exec("CREATE TABLE IF NOT EXISTS levelup (user_id TEXT PRIMARY KEY UNIQUE, xp INTEGER)");
}

client.login(process.env.TOKEN);