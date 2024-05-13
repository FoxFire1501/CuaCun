import { Message } from "discord.js"
import { BotMessageCommand } from "modules/command"
import Bot from "bot";
import topImage from "modules/image/topImage";
import { formatNumber } from "modules/utils";

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
        const top = filteredUserData.map(async (i, id) => `#${id+1} - <@${i.id}> - ${await formatNumber(i.cout)} VND`);
        const userData = await Promise.all(top);
        message.channel.send({
            embeds: [
                {
                    title: "Top chi tiêu trong server!",
                    description: userData.join("\n")
                }
            ]
        })
    }
}

export default new BotMessageCommand({
    name: "top",
    category: "Shop",
    description: "check bảng xếp hạng người giàu",
    run: topCommand
});
