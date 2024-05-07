import { Message, PermissionFlagsBits, userMention } from "discord.js";

import ms from "ms";
import Bot from "bot";
import { BotMessageCommand } from "modules/command.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { getUserID, secondsToTime } from "modules/utils";
import config from "config";


async function muteCommand(message: Message<true>, user?: string, time?: string,...args: string[]) {
    if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) throw new GuildExceptions.NoPermissions();

    const bot = message.client as Bot;
    let userTarget = await getUserID(user)

    if (!userTarget)
        if (!message.mentions.members?.first()) throw new BaseExceptions.UserInputError("user");
        else userTarget = message.mentions.members.first()!.user.id;

    const target = message.guild.members.cache.get(userTarget)

    if (!target) throw new GuildExceptions.TargetNotFound();

    if (!message.guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) throw new GuildExceptions.BotHasNoPermissions();

    if (target.user?.id === bot.user?.id) throw new GuildExceptions.TargetIsSelf();
    if (target.user?.id === message.author.id) throw new GuildExceptions.TargetIsAuthor();

    // all highest roles
    const authorRole = message.member.roles.highest.position;
    const targetRole = target.roles.highest.position;
    const botRole = message.guild.members.me.roles.highest.position;

    if (targetRole >= authorRole) throw new GuildExceptions.AuthorRoleIsLower();
    if (targetRole >= botRole) throw new GuildExceptions.BotRoleIsLower();

   
    if (!time) throw new BaseExceptions.UserInputError("time");

    const timeMute = ms(time);
    if (isNaN(ms(time))) throw new BaseExceptions.UserError("Thời gian mute phải là 1 giá trị như 1s, 1m, 1h, 1d,...");

    target.timeout(ms(time), args.join(" ") || "Không có lý do");

    message.reply({
        embeds: [
            {
                description: `${config.emojis.success} **Đã mute ${target.user.username} thành công** | ${secondsToTime(timeMute / 1000)} - ${args.join(" ") || "Không có lý do"}`,
                color: config.bot.Embed.ColorSuccess
            }
        ]
    })

}

export default new BotMessageCommand({
    name: "mute",
    description: "Mute người dùng",
    category: "Moderation",
    usage: [Required("user"), Required("time"),Optional("reason")],
    run: muteCommand
});