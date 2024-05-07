import { Guild, GuildChannel, Message, PermissionFlagsBits, TextChannel, userMention } from "discord.js";

import ms from "ms";
import Bot from "bot";
import { BotMessageCommand } from "modules/command.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { getChannelID, getUserID, secondsToTime } from "modules/utils";
import config from "config";


async function nukelCommand(message: Message<true>, channel?: string, ...args: string[]) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) throw new GuildExceptions.NoPermissions();

    const bot = message.client as Bot;

    let target = await getChannelID(channel);
    if (!target)
        if (message.mentions.channels.first()) target = message.mentions.channels.first()!.id
        else target = message.channel.id
    

    const channelTarget = await message.guild.channels.cache.get(target)?.fetch() as GuildChannel;
    const newChannel = (await channelTarget.clone())
    try {
        channelTarget.delete()
    } catch {}

    (await (await newChannel.fetch()).guild.channels.cache.get(newChannel.id)?.fetch() as TextChannel).send({
        content: `Nuked by \`\`${message.author.username}\`\``
    })

}

export default new BotMessageCommand({
    name: "nuke",
    description: "Xoá channel",
    category: "Moderation",
    usage: [Optional("channel")],
    run: nukelCommand
});