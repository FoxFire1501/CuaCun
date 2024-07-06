import { Message, PermissionFlagsBits, userMention } from "discord.js";

import ms from "ms";
import Bot from "bot";
import { BotMessageCommand } from "modules/command.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { getChannelID, getUserID, secondsToTime } from "modules/utils";
import config from "config";


async function renameChannelCommand(message: Message<true>, channel?: string, ...args: string[]) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) throw new GuildExceptions.NoPermissions();
    
    const bot = message.client as Bot;
    
    let target = await getChannelID(channel);
    
    if (!target)
        {
            target = message.mentions.channels.first()?.id || message.channel.id;
            args = message.content.split(" ").slice(1);
        } else
    if (!args) throw new BaseExceptions.UserInputError("name")

    try {
        const channelTarget =  message.channel.id == target ? message.channel : await message.guild.channels.cache.get(target)?.fetch();
    
        channelTarget?.edit({
            name: args.join("-").toLocaleLowerCase()
        })
        message.reply({
            embeds: [
                {
                    description: `${config.emojis.success} **Đã đổi tên channel <#${channelTarget?.id}> thành công**`,
                    color: config.bot.Embed.ColorSuccess
                }
            ]
        })
    } catch {
        throw new GuildExceptions.BotHasNoPermissions();
    }



}

export default new BotMessageCommand({
    name: "renamechannel",
    description: "Đổi tên channel",
    category: "Moderation",
    usage: [Required("channel"), Required("name")],
    aliases: ["rn", "rnc"],
    run: renameChannelCommand
});