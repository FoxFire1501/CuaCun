import Bot from "bot";
import { Events, Message, TextChannel, ThreadChannel, codeBlock, inlineCode, userMention } from "discord.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions"
import BotEvent from "modules/event";
import config from "config";

async function messageCommand(message: Message) {
    if (message.author.bot) return;
    if (!message.inGuild()) return;
    if (!message.channel.isTextBased()) return;

    const bot = message.client as Bot;
    bot.user = bot.user!;

    const prefix = await bot.getPrefix(message.guild.id);

    if (message.content == userMention(bot.user.id))
        return message.reply(`Prefix của bot là ${inlineCode(await bot.getPrefix(message.guild.id))} nhé :>`);

    if (!message.content.startsWith(prefix) && !message.content.startsWith(userMention(bot.user.id))) return;

    const [commandName, ...args] = message.content
        .slice(message.content.startsWith(prefix) ? prefix.length : userMention(bot.user.id).length)
        .trim()
        .split(/ +/g);

    if (!commandName) return;

    const command = bot.messageCommands.get(commandName);
    if (!command) return;

    if (!bot.owners.includes(message.author.id)) {
        if (command.ownerOnly) return message.reply("bạn khống có quyền dùng lệnh này>");
        if (!bot.managers.includes(message.author.id) && command.managerOnly) return message.reply("bạn khống có quyền dùng lệnh này>");
    }

    if (!(message.channel instanceof ThreadChannel))
        if (command.nsfw && !message.channel.nsfw) return message.reply("Đi qua cái channel nsfw sú sú kia rồi mới dùng lệnh này nhé :>");

    try {
        await command.run(message, ...args);
    } catch (error) {
        if (error instanceof BaseExceptions.UserInputError) {
            const commandUsage = command.usage.join(" ");
            return message.reply({
                embeds: [
                    {
                        author: {
                            name: "Thiếu tham số",
                            icon_url: bot.user.displayAvatarURL()
                        },
                        description:
                            codeBlock(
                                `${prefix}${command.name} ${commandUsage}\n` +
                                    " ".repeat(`${prefix}${command.name} `.length + commandUsage.indexOf(error.parameter)) +
                                    "^".repeat(error.parameter.length)
                            ) + `Thiếu tham số ${inlineCode(error.parameter)}`,
                        color: config.bot.Embed.Color
                    }
                ]
            });
        }

        if (error instanceof BaseExceptions.UserError) return message.reply({
            embeds: [
                    {
                        description: config.emojis.error + error.message,
                        color: config.bot.Embed.ColorSuccess
                    }
            ]
        });

        message.reply("Có lỗi xảy ra khi chạy lệnh này :<");
        (await message.client.channels.cache.get(config.bot.channelErr)?.fetch() as TextChannel).send(`\`\`\`js\n${error}\`\`\``)
    }
}

export default new BotEvent({
    eventName: Events.MessageCreate,
    run: messageCommand
});