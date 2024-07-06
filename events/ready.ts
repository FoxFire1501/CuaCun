import Bot from "bot";
import config from "config";
import { ActivityType, Client, Events } from "discord.js";
import BotEvent from "modules/event";


async function botReady(client: Client): Promise<any> {
    console.log(`[Login] ${client.user?.username}`);
    client.user?.setPresence({
        activities: [{ name: `Main on 20/07/2024!!`, type: ActivityType.Custom }],
        status: "idle"
    })
}

export default new BotEvent({
    eventName: Events.ClientReady,
    run: botReady
})