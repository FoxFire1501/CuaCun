import Bot from "bot";
import config from "config";
import { Message } from "discord.js";
import { BotMessageCommand } from "modules/command";
import PayOS, {} from "@payos/node";

async function pingCommand(message: Message) {
    const client = message.client as Bot;
    const payos = new PayOS(config.SenkoPay.CLID, config.SenkoPay.APIKEY, config.SenkoPay.CKKEY);
    const orderCodeN = Math.random() * 10000

    const createPay = await payos.cancelPaymentLink(202)

    message.channel.send(createPay.status)
}

export default new BotMessageCommand({
    name: "cpay",
    category: "Shop",
    description: "test",
    run: pingCommand
});