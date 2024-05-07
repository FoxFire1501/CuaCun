import { Message, PermissionFlagsBits, userMention } from "discord.js";

import Bot from "bot";
import { BotMessageCommand } from "modules/command.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { getUserID } from "modules/utils";
import config from "config";

async function banCommand(message: Message<true>, user?: string, ...args: string[]) {
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

    const reason = args.join(" ");

    target.ban({ reason: reason });

    message.reply({
        embeds: [
            {
                description: `${config.emojis.success} **Đã Ban ${target.user.tag} thành công** | ${reason ? reason : "Không có lý do!"}`,
                color: config.bot.Embed.ColorSuccess
            }
        ]
    });

    target
        .send({
            embeds: [
                {
                    title: `Bạn đã bị ban ở server ${message.guild.name}`,
                    description: `Bạn bị ban bởi ${userMention(message.member.user.id)}`,
                    color: config.bot.Embed.Color,
                    fields: [
                        {
                            name: "Lý do",
                            value: reason || "Không có lý do"
                        }
                    ],
                    thumbnail: {
                        url: message.guild.iconURL() ?? ""
                    }
                }
            ]
        })
        .catch(() =>
            message.reply({
                content: "> Có vẻ như người dùng này đã đóng DMs, tôi không thể thông báo cho họ được"
            })
        );
}

export default new BotMessageCommand({
    name: "ban",
    description: "Ban người dùng",
    category: "Moderation",
    usage: [Required("user"), Optional("reason")],
    aliases: ["kill"],
    run: banCommand
});