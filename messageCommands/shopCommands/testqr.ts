import Bot from "bot";
import config from "config";
import {
  ActionRowBuilder,
  Attachment,
  AttachmentBuilder,
  AttachmentFlags,
  ButtonBuilder,
  ButtonStyle,
  Message,
} from "discord.js";
import { BotMessageCommand } from "modules/command";
import PayOS from "@payos/node";
import QRCode from "qrcode";
import { Canvas, loadImage } from "canvas";
import fs from "fs";
import { BaseExceptions } from "modules/exceptions";

async function pingCommand(message: Message, am: string) {
  const client = message.client as Bot;
  const mreact = await message.react("<a:senko_sleepy92:1258338151961989120>");

  
  const orderCodeN = Math.floor(Math.random() * 10000);
  if (isNaN(Number(am))) throw new BaseExceptions.UserError("Số tiền không hợp lệ")

  const createPay = await client.payOs.createPaymentLink({
    orderCode: orderCodeN,
    amount: Number(am) * 1000,
    description: "THANH TOAN",
    cancelUrl: "http://127.0.0.1:5500/cancelUrl",
    returnUrl: "http://127.0.0.1:5500/returnUrl",
  });
  

  function buttom(dis: boolean) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("cancelPay")
        .setStyle(ButtonStyle.Danger)
        .setLabel("Hủy Thanh Toán")
        .setDisabled(dis),
        new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Link Thanh Toán")
        .setDisabled(dis)
        .setURL(createPay.checkoutUrl),
    );
  }

  // message.channel.send(createPay.qrCode);
  const qr = await QRCode.toBuffer(createPay.qrCode, {
    margin: 0,
    color: { dark: "#FFBD59", light: "FFFFF00" },
    type: "png",
    width: 1115,
  });

  const canva = new Canvas(1563, 1563);
  const cvs = canva.getContext("2d");

  const bg = await loadImage("./assets/images/3.png");
  const qrc = await loadImage(qr);

  cvs.drawImage(bg, 0, 0);
  cvs.drawImage(qrc, 223, 174);


  const msg = await message.channel.send({
    embeds: [
      {
        author: { icon_url: client.user?.displayAvatarURL(), name: "SenkoPay" },
        image: { url: "attachment://qr-thanh-toan.png" },
      },
    ],
    files: [
      new AttachmentBuilder(canva.toBuffer(), { name: "qr-thanh-toan.png" }),
    ], 
    components: [buttom(false)],
  });
  await mreact.remove()
  await message.react("<:senko_admire74:1258338153857810505>")

  client.db.set(msg.id, orderCodeN)

  let iCheck = 0;
  async function checkPay(oderID: number) {
    const isPay = await client.payOs.getPaymentLinkInformation(oderID);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    switch (isPay.status) {
      case "PAID":
        msg.edit({
          embeds: [
            {
              author: {
                icon_url: client.user?.displayAvatarURL(),
                name: "SenkoPay",
              },
              image: {
                url: "https://cdn.discordapp.com/attachments/1237816012259201065/1258109507276505099/4.png?ex=6686d949&is=668587c9&hm=ddd425f0c0f3a201355ba3c88f2ee1ebe2bdc47096d27032e32c1c8a61c03423&",
              },
            },
          ],
          components: [],
          files: []
        });
        break;
      case "CANCELLED":
        break;
        default:
        iCheck += 1
        if (iCheck === 300) {
          await client.payOs.cancelPaymentLink(orderCodeN);
          await client.db.delete(msg.id);
          msg.edit({
            embeds: [
            {
                author: {
                icon_url: client.user?.displayAvatarURL(),
                name: "SenkoPay",
                },
                image: {
                url: "https://cdn.discordapp.com/attachments/1237816012259201065/1258885552678375454/SENKO_2.png?ex=6689ac08&is=66885a88&hm=13589e97d04369cb791770ac5214bf57a3dd07b193369914d7a41896ae33d802&",
                },
            },
            ],
            components: [],
            files: []
        })
        }
        checkPay(oderID);
        break;
    }
  }

  await checkPay(orderCodeN);
}

export default new BotMessageCommand({  
  name: "qr",
  category: "Shop",
  description: "test",
  run: pingCommand,
});
