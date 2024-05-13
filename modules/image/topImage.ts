import { Canvas } from "canvas";
import { createCanvas, Image, loadImage, registerFont } from "canvas";
import { GuildMember } from "discord.js";
import * as fs from "fs";
import { formatNumber } from "modules/utils";

registerFont("./assets/font/Airbnb-Cereal-App-ExtraBold.ttf", { family: "AirbnbCerealApp" })
registerFont("./assets/font/iCielBC Lodestone.ttf", { family: "Lodestone" })

interface topData {
    displayName: string,
    displayAvatarURL: string,
    cout: number,
    level: number,
    id: string
}

import Bot from "bot";

export default async function topImage(topData: topData[]) {
    const canvas = createCanvas(2648, 4000);
    const context = canvas.getContext("2d");

    context.drawImage(await loadImage("./assets/images/BGTOP.png"), 0, 0);

    for (let i = 0; i < topData.length; i++) {
        const userData = topData[i];
        const yOffset = 360 + 800 * i; // Tính toán vị trí y dựa trên index
        const yOffsetCas = 590 + 800 * i; // Tính toán vị trí y dựa trên index
        const yOffsetLevel = 575 + 800 * i; // Tính toán vị trí y dựa trên index


        // Vẽ tên người dùng
        context.fillStyle = "white";
        context.font = "900 150px Lodestone";
        context.fillText(userData.displayName, 1320, yOffset);

        // Vẽ thông tin khác của người dùng (ví dụ: exp, level, money)
        // ...

        context.fillStyle = "white";
        context.font = "80px AirbnbCerealApp";
        context.fillText(await formatNumber(userData.cout) + " VND", 1320, yOffsetCas);

        context.fillStyle = "#0da4f4";
        context.font = "50px AirbnbCerealApp";
        context.fillText(`${userData.level}`, 2070, yOffsetLevel);

        // Vẽ ảnh đại diện của người dùng
        const avatarSize = 512;
        const avatarX = 680;
        const avatarY = 129 + 1605 * i/2;
        context.save();
        context.beginPath();
        context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        const avatarImage = await loadImage(userData.displayAvatarURL);
        context.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
        context.restore();
    }

    return canvas.toBuffer();
}
