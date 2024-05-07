import { GuildChannel, Message, PermissionFlagsBits, userMention } from "discord.js";

import ms from "ms";
import Bot from "bot";
import { BotMessageCommand } from "modules/command.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { getChannelID, getUserID, secondsToTime } from "modules/utils";
import config from "config";


async function unlockChannelCommand(message: Message<true>, channel?: string, ...args: string[]) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) throw new GuildExceptions.NoPermissions();

    const bot = message.client as Bot;

    let target = await getChannelID(channel);
    if (!target)
        if (message.mentions.channels.first()) target = message.mentions.channels.first()!.id
        else target = message.channel.id
    

    const channelTarget = await message.guild.channels.cache.get(target)?.fetch() as GuildChannel;
    channelTarget.permissionOverwrites.edit("1114404198361079853", {
        SendMessages: true
    })

    message.reply({
        embeds: [
            {
                description: `${config.emojis.success} **Đã unlock channel <#${channelTarget?.id}> thành công**`,
                color: config.bot.Embed.ColorSuccess
            }
        ]
    })

}

export default new BotMessageCommand({
    name: "unlock",
    description: "Khoá chat channel",
    category: "Moderation",
    usage: [Optional("channel")],
    run: unlockChannelCommand
});