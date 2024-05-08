import { createCanvas, Image, loadImage, registerFont } from "canvas";
import { GuildMember } from "discord.js";
import * as fs from "fs";
import { formatNumber } from "modules/utils";

let background: Image | undefined;

export default async function welcomeCard(member: GuildMember, cout: number, lv: number) {

    const canvas = createCanvas(2048, 718);
    const context = canvas.getContext("2d");

    if (!background) background = await loadImage("assets/images/BG.png");

    context.drawImage(background, 0, 0);

    context.save();

    context.beginPath();
    context.arc(147 + 512 / 2, 107 + 512 / 2, 512 / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.drawImage(await loadImage(member.displayAvatarURL({ extension: "jpg" })), 147, 107, 512, 512);
    context.restore();

    context.fillStyle = "white";
    context.font = "100px NotoSans ";
    context.fillText(member.displayName, 700, 187)
   
    context.font = "100px NotoSans ";

    context.fillText(`${await formatNumber(cout)}`, 1050, 397)

    context.fillText(`${lv}`, 1050, 607)

    // fs.writeFileSync("./canvas.png", canvas.toBuffer());

    return canvas.toBuffer();
}

// welcomeCard()
