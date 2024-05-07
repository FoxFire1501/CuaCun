import { EmbedBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ComponentType,
  inlineCode,
  Message,
  StringSelectMenuBuilder,
} from "discord.js";
import { BotMessageCommand } from "modules/command";
import { Optional } from "modules/usageArgumentTypes";
import { lstatSync, readdirSync } from "fs";
import Bot from "bot";
import config from "config";

interface menuOptionVale {
  label: string;
  description: string;
  value: string;
  embed?: EmbedBuilder;
}

async function helpCommand(message: Message<true>) {
  const bot = message.client as Bot;

  const commandName = message.content.split(" ")[1];
  if (commandName) {
    const command = bot.messageCommands.get(commandName);
    if (!command) return message.reply("Command not found.");

    let commandUsage = "";

    const embed = new EmbedBuilder({
      title: inlineCode(
        (await bot.getPrefix(message.guild.id)) + command.name
      ),
      description: command.description,
      color: config.bot.Embed.Color,
      fields: [
        {
          name: "Category",
          value: command.category ?? "None",
          inline: true,
        },
      ],
      footer: {
        text: `Requested by ${message.author.tag}`,
        icon_url: message.author.displayAvatarURL(),
      },
    });

    if (command.aliases.length > 0)
      embed.addFields([{ name: "Aliases", value: command.aliases.join(", ") }]);

    if (command.usage.length > 0)
      command.usage.forEach(
        (usage) =>
          (commandUsage += " " + usage.wrap[0] + usage.argument + usage.wrap[1])
      );
    embed.addFields([
      {
        name: "Usage",
        value: inlineCode(
          (await bot.getPrefix(message.guild.id)) +
            command.name +
            commandUsage
        ),
      },
    ]);

    return message.reply({ embeds: [embed] });
  } else {
    // const categories = new Set();
    // for (const command of bot.messageCommands.values())
    //     categories.add(command.category);

    // message.reply({
    //     embeds: [
    //         {
    //             title: "Help",
    //             description: `Use \`${await bot.getPrefix(message.guild.id)}help <command>\` to get more information about a command.`,
    //             color: bot.branding.embedColor
    //         }
    //     ]
    // });

    const menuoption: menuOptionVale[] = [];
    const categorieOption: string[] = [];
    const menuCommand: string[] = [];

    const prefix = await bot.getPrefix(message.guild.id);

    bot.messageCommands.forEach(async (x) => {
      if (!categorieOption.includes(x.category ?? "a")) {
        if (!x.category?.length) return;
        const embed = new EmbedBuilder()
          .setTitle(`Đang xem mọi command của ${x.category}`)
          .setColor(config.bot.Embed.Color)
          .setFooter({
            text: `Dùng ${prefix}help [tên lệnh] để xem thông tin cụ thể hơn!`,
          });
        categorieOption.push(x.category ?? "khác");
        menuoption.push({
          label: x.category ?? "",
          description: `Xem mọi command của ${x.category}`,
          value: x.category ?? "",
          embed: embed,
        });
      }

      if (!menuCommand.includes(x.name)) {
        menuoption
          .find((t) => t.label === x.category)
          ?.embed?.addFields({
            name: prefix + x.name,
            value: `\`\`${x.description}\`\``,
            inline: true,
          });
        menuCommand.push(x.name);
      }
    });

    console.log(menuoption)

    const msg = await message.reply({
      embeds: [
        {
          title: `Commands Help của ${bot.user?.username}`,
          description: `Bạn có thể dùng menu bên dưới để chọn loại lệnh bạn muốn xem!!`,
          author: {
            icon_url: bot.user?.avatarURL() ?? "",
            name: bot.user?.username ?? "",
          },
          color: config.bot.Embed.Color,
        },
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("help-menu")
              .setOptions(menuoption)
          )
      ],
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) => i.user.id === message.author.id,
      idle: 60_000,
    });

    collector.on("collect", async (i) => {
      if (!i.isStringSelectMenu()) return;
      const option = menuoption.find((x) => x.value === i.values[0]);
      if (option?.embed)
        i.update({
          embeds: [option.embed],
        });
    });
  }
}

export default new BotMessageCommand({
  name: "help",
  category: "misc",
  description: "Shows help",
  usage: [Optional("command")],
  run: helpCommand,
});