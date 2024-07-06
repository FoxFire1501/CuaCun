import Bot from "bot";
import config from "config";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { BotMessageCommand } from "modules/command";
import { BaseExceptions } from "modules/exceptions";
import { Optional, Required } from "modules/usageArgumentTypes";
import { formatNumber } from "modules/utils";

async function ctCommand(message: Message, cout: string, ad: string) {
    const client = message.client as Bot;
    if (cout) {
        let adm = {
            nh: "",
            stk: ""
        }
        if (isNaN(Number(cout))) throw new BaseExceptions.UserError("Số tiền không hợp lệ")
        const r = "CUN" + (Math.random() + 1).toString(36).substring(7);
        if (message.author.id == "1099044499474370670") adm = {
            nh: "mb",
            stk: "000000002006"
        }
        else if (message.author.id == "772654749736108052") adm = {
            nh: "vcb",
            stk: "1042044812"
        } 
        else if (message.author.id == "1195381172549722204") adm = {
            nh: "vcb",
            stk: "0231000583198"
        }
        const msd = await message.channel.send({
            embeds: [
                {
                    image: { url: `https://vietqr.co/api/generate/${adm.nh}/${adm.stk}/VIETQR.CO/${Number(cout) * 1000}/${r}?style=2&logo=1&isMask=1&bg=61` },
                    title: "Qr Chuyển Tiền!",
                    fields: [
                        { name: "Số tiền:", value: await formatNumber(Number(cout) * 1000) + " VND", inline: true },
                        { name: "Mã só đơn:", value: r, inline: true }
                    ]
                }
            ]
        });

        const db = await client.db.get(`${message.guild?.id}.dataBank`)
        if (db) client.db.push(`${message.guild?.id}.dataBank`, r)
            else client.db.set(`${message.guild?.id}.dataBank`, [r])
        client.db.set(r, msd.id)

    } else {
        const ms = await message.channel.send({
            content: "",
            embeds: [
                {
                    title: "Payment Methods:",
                    fields: [
                        { name: "**MBBank Le Hai Dang:**", value: `000000002006`, inline: true },
                        { name: "**Momo Le Hai Dang:**", value: `0794919029`, inline: true },
                        { name: "**Timo:**", value: `0788651471`, inline: true }
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
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("MOMO")
                    .setLabel("Momo")
                    .setEmoji(config.emojis.momo)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("Timo")
                    .setLabel("Timo")
                    .setEmoji(config.emojis.timo)
                    .setStyle(ButtonStyle.Secondary),
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
                    i.showModal(await infoCopy(i.customId, "000000002006"))
                    break;
                case "MOMO":
                    i.showModal(await infoCopy(i.customId, "0794919029"))
                    break;
                case "CardVip":
                    i.showModal(await infoCopy(i.customId, "namtrieule2006@gmail.com"))
                    break;
                case "Timo":
                    i.showModal(await infoCopy(i.customId, "0788651471"))
                    break;
                default:
                    break;
            }
        })
    }
}

export default new BotMessageCommand({
    name: "bank",
    aliases: ["ct"],
    category: "Shop",
    description: "Thông tin chuyển tiền",
    usage: [Optional("cout")],
    run: ctCommand
});