const Collection = require("@discordjs/collection");
const config = require("./config.json");

/**
 * @type {Collection.Collection<string, Command>}
 */
const commands = new Collection();

/**
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 * @param {CommandExtra} extra
 */
async function helpCommand(message, args, extra)
{
	await message.channel.send("**Commands**\nhelp, level");
}

/**
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 * @param {CommandExtra} extra
 */
function logoutCommand(message, args, extra)
{
	if (config.ownerIDs.includes(message.author.id))
	{
		message.client.destroy();
		process.exit();
	}
}

/**
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 * @param {CommandExtra} extra
 */
async function levelCommand(message, args, extra)
{
	const data = extra.statements.selectXp.get(message.author.id);
	await message.channel.send(`Your xp=${data.xp}`);
}

commands.set("help", {
	name: "help",
	aliases: [],
	run: helpCommand
});

commands.set("level", {
	name: "level",
	aliases: [],
	run: levelCommand
});

commands.set("logout", {
	name: "logout",
	aliases: ["disconnect"],
	run: logoutCommand
});

module.exports = commands;

/**
 * @typedef {Object} CommandExtra - Additional parameter for database interaction
 * @property {import("better-sqlite3").Database} database
 * @property {Object} statements
 * @property {import("better-sqlite3").Statement} statements.selectXp
 * @property {import("better-sqlite3").Statement} statements.updateXp
 * @property {import("better-sqlite3").Statement} statements.insertUser
 *
 * @typedef {Object} Command
 * @property {string} name
 * @property {string[]} aliases
 * @property {Command.run} run
 *
 * @callback Command.run
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 * @param {CommandExtra} extra
 */