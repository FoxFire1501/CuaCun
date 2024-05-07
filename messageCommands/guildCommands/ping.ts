import Bot from "bot";
import config from "config";
import { Message } from "discord.js";
import { BotMessageCommand } from "modules/command";

async function pingCommand(message: Message) {
    const client = message.client as Bot;
    const replyMessage = await message.reply("Measuring ping...");
    replyMessage.edit({
        content: "",
        embeds: [
            {
                fields: [
                    { name: "User Ping:", value: `${replyMessage.createdTimestamp - message.createdTimestamp}ms` },
                    { name: "Bot Ping:", value: `${Math.round(client.ws.ping)}ms` }
                ],
                footer: { text: client.user?.username ?? "" },
                timestamp: new Date().toISOString(),
                color: config.bot.Embed.Color
            }
        ]
    });
}

export default new BotMessageCommand({
    name: "ping",
    aliases: ["pong"],
    category: "misc",
    description: "Pings the bot",
    run: pingCommand
});