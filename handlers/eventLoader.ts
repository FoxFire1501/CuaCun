import { readdirSync } from "fs";

import BotEvent from "modules/event";
import Bot from "bot";

const EVENT_DIR = "./events/";

export default async function loadEvents(bot:Bot) {
    readdirSync(EVENT_DIR).forEach(async f => {
        const clientEvent = (await import(`.${EVENT_DIR}${f}`)).default as BotEvent<any>;
        if (clientEvent.once) bot.once(clientEvent.eventName, clientEvent.run);
        else bot.on(clientEvent.eventName, clientEvent.run);
    })
}