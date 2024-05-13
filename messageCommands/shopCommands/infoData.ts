import Bot from "bot";
import config from "config";
import { Message } from "discord.js";
import { BotMessageCommand } from "modules/command";

async function pingCommand(message: Message) {
    const client = message.client as Bot;
    console.log(await client.db.get(message.guild?.id ?? ""))
    console.log(await client.db.all())
}

export default new BotMessageCommand({
    name: "testdb",
    aliases: ["pong"],
    category: "misc",
    description: "Pings the bot",
    run: pingCommand
})