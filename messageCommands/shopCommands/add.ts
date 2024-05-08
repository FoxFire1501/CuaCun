import { Message } from "discord.js";
import config from "config";
import Bot from "bot";
import { BotMessageCommand } from "modules/command";
import { formatNumber, getUserID } from "modules/utils";
import { BaseExceptions } from "modules/exceptions";

interface userInfo {
    cout: number;
    level: number;
    commands: number;
    messages: number;
    voice_time: number;
}

async function addCommand(message: Message, user: string, cout: string) {
    const client = message.client as Bot;

    let target = await getUserID(user);
    if (!target)
        if (message.mentions.members!.first()) throw new BaseExceptions.UserInputError("user");
        else target = message.mentions.members?.first()?.id


    let coutT = Number(cout)

    if (!cout) throw new BaseExceptions.UserInputError("cout")
        else if (isNaN(coutT)) throw new BaseExceptions.UserError("Số tiền không xác định")
    
    let data = await client.db.get(`${target}.info`) as userInfo;


    client.db.add(`${target}.info.cout`, (Number(cout) * 1000))

    console.log(await client.db.all())

    message.reply(`${await formatNumber(data.cout) + Number(cout) * 1000}`)
}

export default new BotMessageCommand({
    name: "add",
    aliases: ["a"],
    category: "Shop",
    description: "Công thêm tiền vào j ko biết",
    run: addCommand
});