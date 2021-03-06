const { Collection, MessageEmbed } = require("discord.js");
const { stripIndent } = require("common-tags");
const config = require("./config.json");

/**
 * @type {Collection<string, Command>}
 */
const commands = new Collection();

/**
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 * @param {CommandExtra} extra
 */
async function helpCommand(message, args, extra)
{
    await message.channel.send(
        new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Kyle David Help Menu")
            .setThumbnail(message.author.displayAvatarURL())
            .addField("\u200b", stripIndent`
                ❓ **Help**: Displays this help command \n
                🆙 **Level**: Check your XP and rank in the server \n
                🌠 **Top**: Lists the top 10 members in this server
            `)
            .setFooter(`ID: ${message.author.id}`)
            .setTimestamp()
    );
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

    await message.channel.send(
        new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`⭐ **${message.author.username}**, you have **${data.xp}** XP in this server!`)
            .setFooter(`ID: ${message.author.id}`)
            .setTimestamp()
    );
}

/**
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 * @param {CommandExtra} extra
 */
async function topCommand(message, args, extra)
{
    const data = extra.database.prepare("SELECT * FROM levelup ORDER BY xp DESC").all();
    const entries = [];

    for (let i = 0; i < data.slice(0, 10).length; i++)
    {
        const member = await message.guild.members.fetch(data[i].user_id);

        if (!member)
        {
            i++;
            continue;
        }
        else
        {
            entries.push(stripIndent`
            ${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`} **${member.user.tag}**: ${data[i].xp} XP
            `);
        }
    }

    await message.channel.send(
        new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${message.guild.name}'s Leaderboard`)
            .setThumbnail(message.guild.iconURL())
            .addField("\u200b", entries.join("\n\n"))
            .setFooter(`ID: ${message.author.id}`)
            .setTimestamp()
    );
}

commands.set("help", {
    name: "help",
    aliases: [],
    run: helpCommand
});

commands.set("level", {
    name: "level",
    aliases: ["rank"],
    run: levelCommand
});

commands.set("top", {
    name: "top",
    aliases: ["leaderboard"],
    run: topCommand
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