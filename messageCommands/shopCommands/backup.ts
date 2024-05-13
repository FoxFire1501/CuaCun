import { Guild, GuildChannel, Message, PermissionFlagsBits, TextChannel, userMention } from "discord.js";

import ms from "ms";
import Bot from "bot";
import { BotMessageCommand } from "modules/command.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { getChannelID, getUserID, secondsToTime } from "modules/utils";
import config from "config";
import { ExportReturnType, createTranscript } from "discord-html-transcripts";


async function lockChannelCommand(message: Message<true>, channel?: string, ...args: string[]) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) throw new GuildExceptions.NoPermissions();

    const bot = message.client as Bot;

    let target = await getChannelID(channel);
    if (!target)
        if (message.mentions.channels.first()) target = message.mentions.channels.first()!.id
        else target = message.channel.id
    

    const channelTarget = await message.guild.channels.cache.get(target)?.fetch() as TextChannel;
    if (!channelTarget) return;
    const filename = `${channelTarget.name}-backup.html`;
    const transcript = await createTranscript(channelTarget, {
        limit: -1,
        returnType: ExportReturnType.Attachment,
        filename: filename,
        poweredBy: false
    });


    message.reply({
        embeds: [
            {
                author: { name: message.member?.user.username ?? "", icon_url: message.member.displayAvatarURL() ?? "" },
                fields: [
                    { name: "Người tạo", value: userMention(message.member.id), inline: true },
                    { name: "ID", value: channelTarget.id, inline: true },
                    {
                        name: "Tên",
                        value: channelTarget.name,
                        inline: true
                    }
                ],
                color: config.bot.Embed.Color
            }
        ],
        files: [transcript]
    })

}

export default new BotMessageCommand({
    name: "backup",
    description: " backup channel",
    category: "Moderation",
    usage: [Optional("channel")],
    run: lockChannelCommand
});