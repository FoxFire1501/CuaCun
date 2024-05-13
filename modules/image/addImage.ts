import { createCanvas, Image, loadImage, registerFont } from "canvas";
import { GuildMember } from "discord.js";
import * as fs from "fs";
import { formatNumber } from "modules/utils";

let background: Image | undefined;

registerFont("./assets/font/Aquire-BW0ox.otf", { family: "Aquire" })
registerFont("./assets/font/iCielBC Lodestone.ttf", { family: "Lodestone" })


export default async function addImage(member?: GuildMember, cout?: number, add?: boolean) {

    const canvas = createCanvas(737, 454);
    const context = canvas.getContext("2d");

    let backgroundADD = await loadImage("./assets/images/ADD.png");
    let backgroundREM = await loadImage("./assets/images/REM.png");


    context.drawImage(add ? backgroundADD : backgroundREM, 0, 0);

    
    context.save();
    context.fillStyle = "white"
    context.font = "20px Lodestone"
    context.fillText(member?.displayName ? "-" + member?.displayName : "- MrCáo", 150, 310)

    context.font = "50px Aquire"
    context.fillText(cout ? await formatNumber(cout) + " VND" : "100.000.000 VND", 190, 390)
    
    const avatarSize = 260;
    const avatarX = 235;
    const avatarY = 10;

    context.beginPath();
    context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    const avatarImage = await loadImage(member?.displayAvatarURL({ extension: "jpg" }) ?? "https://cdn.discordapp.com/attachments/1235995536230842529/1238844704536264795/GMozzQobEAApElv.jpg?ex=66416c4a&is=66401aca&hm=0480a17b4ed531fe132faa3f6cc1b758879d216f9f4127967d1f9f84fdd10c3a&");
    context.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
    context.restore();

    // fs.writeFileSync("./canvas.png", canvas.toBuffer());

    return canvas.toBuffer();
}

// welcomeCard()
