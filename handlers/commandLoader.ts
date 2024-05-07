import { lstatSync, readdirSync } from "fs";

import { BotMessageCommand, BotSlashCommand } from "../modules/command";
import Bot from "../bot";

export default async function loadCommands(bot: Bot) {
    async function loadCommand(root: string, item: string): Promise<any> {
        if (lstatSync(root + item).isDirectory()) {
            const newRoot = root + item + "/";
            return readdirSync(newRoot).forEach(async item => loadCommand(newRoot, item));
        }
        const command = (await import(`.${root}${item}`)).default as BotMessageCommand | BotSlashCommand;
        if (command instanceof BotSlashCommand) return bot.db.set(command.data.name, command);

        bot.messageCommands.set(command.name, command);
        command.aliases?.forEach(alias => bot.messageCommands.set(alias, command));
    }

    for (const folder of ["./messageCommands/", "./slashCommands/"]) readdirSync(folder).forEach(async item => loadCommand(folder, item));
}