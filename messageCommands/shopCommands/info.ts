import { AttachmentBuilder, Message } from "discord.js";
import config from "config";
import Bot from "bot";
import { BotMessageCommand } from "modules/command";
import { formatNumber, getUserID } from "modules/utils";
import { BaseExceptions } from "modules/exceptions";
import welcomeCard from "modules/image/infoImage";

interface userInfo {
    cout: number;
    level: number;
    commands: number;
    messages: number;
    voice_time: number;
}

async function addCommand(message: Message, user: string) {
    const client = message.client as Bot;

    let target = await getUserID(user);
    if (!target)
        if (!message.mentions.members?.first()) target = message.author.id;
        else target = message.mentions.members?.first()?.id

    
    let data = await client.db.get(`${target}.info`) as userInfo;
    if (!data) data = await client.db.set(`${target}.info`, {
        cout: 0,
        level: 1,
        commands: 0,
        messages: 0,
        voice_time: 0
    })

    if (message.member)
    message.channel.send({
        files: [
            {
                attachment: await welcomeCard((await message.guild?.members.cache.get(target ?? "")?.fetch()) ?? message.member, data.cout, data.level)
            }
        ]
    })
}

export default new BotMessageCommand({
    name: "info",
    aliases: ["if"],
    category: "Shop",
    description: "Thông tin bla bla",
    run: addCommand
});