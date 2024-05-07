import Bot from "bot";
import config from "config";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { BotMessageCommand } from "modules/command";

async function ctCommand(message: Message) {
    const client = message.client as Bot;
    const ms = await message.channel.send({
        content: "",
        embeds: [
            {
                title: "Payment Methods:",
                fields: [
                    { name: "**MBBank Le Hai Dang:**", value: `004807902999` },
                    { name: "**Momo Le Hai Dang:**", value: `0794919029` },
                    { name: "**CardVip:**", value: `namtrieule2006@gmail.com` }

                ],
                footer: { text: client.user?.username ?? "" },
                timestamp: new Date().toISOString(),
                color: config.bot.Embed.Color
            }
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>().setComponents(
                new ButtonBuilder()
                .setCustomId("MB")
                .setLabel("MB")
                .setEmoji(config.emojis.mb)
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId("MOMO")
                .setLabel("MOMO")
                .setEmoji(config.emojis.momo)
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId("CardVip")
                .setLabel("CardVip")
                .setEmoji(config.emojis.cardvip)
                .setStyle(ButtonStyle.Success),
            )
        ]
    });

    const c = ms.createMessageComponentCollector();

    async function infoCopy(info: string, data: string) {
        return new ModalBuilder()
        .setTitle(info.toUpperCase())
        .setCustomId("copyinfo")
        .setComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setLabel("Mời bạn copy")
                .setCustomId("copy")
                .setStyle(TextInputStyle.Short)
                .setValue(data)
            )
        )
    }

    c.on("collect",async i => {
        switch (i.customId) {
            case "MB":
                i.showModal(await infoCopy(i.customId, "004807902999"))
                break;
            case "MOMO":
                i.showModal(await infoCopy(i.customId, "0794919029"))
                break;
            case "CardVip":
                i.showModal(await infoCopy(i.customId, "namtrieule2006@gmail.com"))
                break;
            default:
                break;
        }
    })
}

export default new BotMessageCommand({
    name: "bank",
    aliases: ["ct"],
    category: "Shop",
    description: "Thông tin chuyển tiền",
    run: ctCommand
});