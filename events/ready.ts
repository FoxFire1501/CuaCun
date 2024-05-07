import Bot from "bot";
import config from "config";
import { ActivityType, Client, Events } from "discord.js";
import BotEvent from "modules/event";


async function botReady(client: Client): Promise<any> {
    console.log(`[Login] ${client.user?.username}`);
    client.user?.setPresence({
        activities: [{ name: `Testing!!`, type: config.bot.Status.type }],
        status: 'idle'
    })
}

export default new BotEvent({
    eventName: Events.ClientReady,
    run: botReady
})