import Bot from "bot";
import { Events, Interaction, Message, TextChannel, ThreadChannel, codeBlock, inlineCode, userMention } from "discord.js";
import { BaseExceptions, GuildExceptions } from "modules/exceptions"
import BotEvent from "modules/event";
import config from "config";

async function  payButtonCreate(i:Interaction) {
    try {
        if (!i.isButton()) return;
        const client = i.client as Bot;
        if (i.customId === "cancelPay") {
            i.message.edit({
                embeds: [
                {
                    author: {
                    icon_url: client.user?.displayAvatarURL(),
                    name: "SenkoPay",
                    },
                    image: {
                    url: "https://cdn.discordapp.com/attachments/1237816012259201065/1258107006863015997/SENKO_1.png?ex=6686d6f4&is=66858574&hm=74fe0cbc1e0364cfc170c9d888df039bc8274f05cc1320db0c6bbb1c74829502&",
                    },
                },
                ],
                components: [],
                files: []
            })
            i.reply({content: "Đã hủy thanh toán thành công", ephemeral: true})
            const orderCodeN = await client.db.get(i.message.id) as number;
            await client.payOs.cancelPaymentLink(orderCodeN);
            await client.db.delete(i.message.id);
        }
    } catch {}
}

export default new BotEvent({
    eventName: Events.InteractionCreate,
    run: payButtonCreate
});