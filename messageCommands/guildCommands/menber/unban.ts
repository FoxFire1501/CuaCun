import { Message, PermissionFlagsBits, userMention } from "discord.js";

import Bot from "bot";
import { BotMessageCommand } from "modules/command.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { getUserID } from "modules/utils";
import config from "config";


async function unbanCommand(message: Message<true>, user?: string, ...args: string[]) {
    if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) throw new GuildExceptions.NoPermissions();

    const bot = message.client as Bot;

    if (!user) throw new BaseExceptions.UserInputError("userID");
    if (!message.guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) throw new GuildExceptions.BotHasNoPermissions();
    if (!message.guild.bans.cache.get(user)) throw new GuildExceptions.TargetNotFound();
   try {
     message.guild.bans.remove(user, args.join(" ") || "Không có lý do");
   } catch (err) {
        throw new GuildExceptions.TargetNotFound()
   }

   message.reply({
    embeds: [
        {
            description: `${config.emojis.success} **Đã UnBan ${user} thành công**`,
            color: config.bot.Embed.ColorSuccess
        }
    ]
});
    
}

export default new BotMessageCommand({
    name: "unban",
    description: "Unban người dùng",
    category: "Moderation",
    usage: [Required("userID"), Optional("reason")],
    run: unbanCommand
});