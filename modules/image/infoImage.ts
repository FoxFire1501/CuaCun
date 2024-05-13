import { createCanvas, Image, loadImage, registerFont } from "canvas";
import { GuildMember } from "discord.js";
import * as fs from "fs";
import { formatNumber } from "modules/utils";

let background: Image | undefined;

registerFont("./assets/font/Airbnb-Cereal-App-ExtraBold.ttf", { family: "AirbnbCerealApp" })
registerFont("./assets/font/iCielBC Lodestone.ttf", { family: "Lodestone" })


export default async function welcomeCard(member?: GuildMember, cout?: number, lv?: number) {

    const canvas = createCanvas(2048, 718);
    const context = canvas.getContext("2d");

    if (!background) background = await loadImage("./assets/images/BG.png");

    context.drawImage(background, 0, 0);

    context.save();

    context.beginPath();
    context.arc(110 + 512 / 2, 107 + 512 / 2, 512 / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.drawImage(await loadImage(await member?.user.avatarURL({ extension: "jpg" }) ?? "https://cdn.discordapp.com/attachments/1235995536230842529/1235995695001899189/GMnkjTvbgAArb4q.jpg?ex=66404971&is=663ef7f1&hm=304140c881118b5b3c8d97c3e592842f658ccf7ce3cf29c41f8dcac159552cd4&"), 110, 107, 512, 512);
    context.restore();

    context.fillStyle = "white";
    context.font = "900 150px Lodestone";
    
    context.fillText(member?.displayName ?? "MrCáo", 745, 330)
   
    context.font = "80px AirbnbCerealApp";
    context.fillText(cout ? `${await formatNumber(cout)} VND` : `0 VND`, 745, 560);

    context.fillStyle = "#0da4f4";
    context.font = "50px AirbnbCerealApp";
    context.fillText(`1`, 1500, 545);

    // fs.writeFileSync("./canvas.png", canvas.toBuffer());

    return canvas.toBuffer();
}

// welcomeCard()
