import { Guild, GuildChannel, Message, PermissionFlagsBits, TextChannel, userMention } from "discord.js";

import ms from "ms";
import Bot from "bot";
import { BotMessageCommand } from "modules/command.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { getChannelID, getUserID, secondsToTime } from "modules/utils";
import config from "config";


async function deleteCommand(message: Message<true>, channel?: string, ...args: string[]) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) throw new GuildExceptions.NoPermissions();

    const bot = message.client as Bot;

    let target = await getChannelID(channel);
    if (!target)
        if (message.mentions.channels.first()) target = message.mentions.channels.first()!.id
        else target = message.channel.id
    

    const channelTarget = await message.guild.channels.cache.get(target)?.fetch() as GuildChannel;
    try {
        channelTarget.delete(args.join(""))
    } catch {}
}

export default new BotMessageCommand({
    name: "kill",
    description: "Xoá channel",
    category: "Moderation",
    usage: [Optional("channel")],
    run: deleteCommand
});