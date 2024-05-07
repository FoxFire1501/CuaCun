import { ClientEvents } from "discord.js";

interface BotEventOption<Event extends keyof ClientEvents> {
    eventName: Event;
    once?: boolean;
    run: (...args: ClientEvents[Event]) => Promise<any>;
}

export default class BotEvent<Event extends keyof ClientEvents> {
    constructor(option: BotEventOption<Event>) {
        this.eventName = option.eventName;
        this.once = option.once;
        this.run = option.run;
    }
    
    eventName;
    once?;
    run
}