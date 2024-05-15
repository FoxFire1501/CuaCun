import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from "discord.js"
import { BotMessageCommand } from "modules/command"
import Bot from "bot";
import topImage from "modules/image/topImage";
import { formatNumber } from "modules/utils";
import config from "config";

interface TopData {
    displayName: string;
    displayAvatarURL: string;
    cout: number;
    level: number;
    id: string
}

interface userInfo {
    cout: number;
    level: number;
    commands: number;
    messages: number;
    voice_time: number;
}

async function topCommand(message: Message, option?: string) {
    if (message.author.bot) return;

    const client = message.client as Bot;
    const guildId = message.guild?.id ?? "";
    const dataUsers = await client.db.get(guildId) as object;

    if (!dataUsers) return message.channel.send({embeds: [
        {
            title: "Top chi tiêu trong server hiện tại chưa có!"
        }
    ]})

    const userDataPromises = Object.keys(dataUsers)
        .filter(key => !isNaN(Number(key)))
        .map(async (userId) => {
            const userData = await client.db.get(`${guildId}.${userId}.info`) as userInfo;
            const member = message.guild?.members.cache.get(userId);
            if (member) {
                return {
                    displayName: member.displayName,
                    displayAvatarURL: member.user.displayAvatarURL({ extension: "jpg" }) ?? "",
                    cout: userData.cout,
                    level: userData.level,
                    id: member.id
                };
            }
        });

    const userData = await Promise.all(userDataPromises);
    const filteredUserData = userData.filter(user => user !== undefined) as TopData[];

    filteredUserData.sort((a, b) => b.cout - a.cout);

    if (option?.toLocaleLowerCase() !== "all") {
        const topImageBuffer = await topImage(filteredUserData);

        const mgs = await message.channel.send({
            files: ["https://cdn.discordapp.com/attachments/1235995536230842529/1238905442000699485/SH_Loading_Discord.gif?ex=6640fc1b&is=663faa9b&hm=e721cb08a98cc9f8ead8dfb8061bcfde2d7ca5a3e7a8338fcf937e8f739b6abd&"]
        })
        mgs.edit({
            files: [{ attachment: topImageBuffer }]
        });
    } else {
        let newPage = true;
        let pageId = 1;
        let pageView: string[] = [];
        const top = filteredUserData.map(async (i, id) => `#${id+1} - <@${i.id}> - ${await formatNumber(i.cout)} VND`);
        let userData: string[] = await Promise.all(top);
        
        async function page(userData: string[], page: number) {
            let startData = 0;
            let endData = 15;
            if (page > 1) {
                startData = (page - 1) * 15;
                endData = page * endData
            };
            return userData.slice(startData, endData);
        }

        console.log(userData.length)
        console.log((await page(userData, pageId)).length)

        async function button(dis:boolean, id: string, emojis: string) {
            return new ButtonBuilder()
            .setCustomId(id)
            .setEmoji(emojis)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(dis)
        }

        const endPage = Math.floor(userData.length / 15) + 1;


        async function msData(userDataDf: string[], pageId: number, endPage: number) {
            return {
                embeds: [
                    {
                        title: "Top chi tiêu trong server!",
                        description: (await page(userDataDf, pageId)).join("\n"),
                        footer: { text: `Trang: ${pageId} / ${endPage}` }
                    }
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().setComponents(
                        await button(pageId <= 1 ? true : false, "leave", config.emojis.leave),
                        await button(pageId == endPage ? true : false, "join", config.emojis.join)
                    )
                ]
            }
        }

        const mgs = await message.channel.send(await msData(userData, pageId, endPage));


        const c = mgs.createMessageComponentCollector({ filter: i => i.user.id === message.member?.id });
        c.on("collect", async (i) => {
            if (i.customId === "leave") {
                pageId -= 1;
                i.update(await msData(userData, pageId, endPage))
            } else if (i.customId === "join") {
                pageId += 1;
                i.update(await msData(userData, pageId, endPage))
            }
        })

    }
}

export default new BotMessageCommand({
    name: "top",
    category: "Shop",
    description: "check bảng xếp hạng người giàu",
    run: topCommand
});
