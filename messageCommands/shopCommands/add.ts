import { GuildMember, Message } from "discord.js";
import config from "config";
import Bot from "bot";
import { BotMessageCommand } from "modules/command";
import { formatNumber, getUserID } from "modules/utils";
import { Optional, Required } from "modules/usageArgumentTypes";
import { BaseExceptions, GuildExceptions } from "modules/exceptions";
import addImage from "modules/image/addImage";

interface userInfo {
    cout: number;
    level: number;
    commands: number;
    messages: number;
    voice_time: number;
}

async function addCommand(message: Message, user: string, cout: string) {
    const client = message.client as Bot;
    let isAdd = true;

    let target = await getUserID(user);
    if (!target)
        if (!message.mentions.members!.first()) throw new BaseExceptions.UserInputError("user");
        else target = message.mentions.members?.first()?.id


    let coutT = Number(cout)

    if (!cout) throw new BaseExceptions.UserInputError("cout")
        else if (isNaN(coutT)) throw new BaseExceptions.UserError("Số tiền không xác định")
    
    if (cout.startsWith("-")) isAdd = false;
        
    let data = await client.db.get(`${message.guild?.id}.${target}.info`) as userInfo;
    if (!data) data = await client.db.set(`${message.guild?.id}.${target}.info`, {
        cout: 0,
        level: 1,
        commands: 0,
        messages: 0,
        voice_time: 0
    })
    const memberTarget = await message.guild?.members.cache.get(target ?? "")?.fetch();
    let coutTX;
    if (isAdd) coutTX = coutT * 1000 + (data.cout ? data.cout : 0)
        else coutTX = coutT * 1000 - (data.cout ? data.cout : 0)
    if (coutTX < 0) coutTX = 0;
    client.db.set(`${message.guild?.id}.${target}.info.cout`, coutTX)

    message.channel.send({
        embeds: [
            {
                title: `Thông báo biến động | ${memberTarget?.displayName}`,
                description: `Bạn đã ${isAdd ? "Được công" : "Bị trừ"} vào ví tiêu dùng số tiền \`\`${await formatNumber(coutTX)} VND\`\``,
                thumbnail: { url: "https://discords.com/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Femojis%2F935048366352637952.png%3Fv%3D1&w=64&q=75" },
                footer: { icon_url: memberTarget?.displayAvatarURL(), text: "Mọi thắc mắc liện hệ Dev" }
            }
        ]
    })
}

export default new BotMessageCommand({
    name: "money",
    aliases: ["mon", "m"],
    category: "Shop",
    description: "Công hoặc trừ tiền vào j ko biết",
    usage: [Required("user"), Required("cout")],
    managerOnly: true,
    run: addCommand
});