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
    
    if (coutT < 0) isAdd = false;
        
    let data = await client.db.get(`${message.guild?.id}.${target}.info`) as userInfo;
    if (!data) data = await client.db.set(`${message.guild?.id}.${target}.info`, {
        cout: 0,
        level: 1,
        commands: 0,
        messages: 0,
        voice_time: 0
    })
    const memberTarget = await message.guild?.members.cache.get(target ?? "")?.fetch();



    client.db.add(`${message.guild?.id}.${target}.info.cout`, (Number(cout) * 1000))

    message.channel.send({
        files: [
            {
                attachment: await addImage(memberTarget, coutT*1000, isAdd)
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