const Collection = require("@discordjs/collection");
const config = require("./config.json");

const commands = new Collection();

/**
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 */
async function helpCommand(message, args)
{
	await message.channel.send("**Commands**\nhelp, level");
}

/**
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 */
function logoutCommand(message, args)
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