import { Client, ClientOptions, GatewayIntentBits, Snowflake } from "discord.js";
import {} from "fs";
import { BotMessageCommand, BotSlashCommand } from "modules/command";

import { QuickDB } from "quick.db";

import database from "handlers/databaseLoader"
import config from "config";

import loadCommands from "handlers/commandLoader";
import loadEvents from "handlers/eventLoader";
import botWebLoader from "handlers/botWebLoder";
import payos from "handlers/payLoader";
import PayOS from "@payos/node";

interface BotOption extends ClientOptions {
    version: string;
    prefix?: string;

    owners?: string[];
    managers?: string[];
};

export default class Bot extends Client {
    constructor(option: BotOption) {
        super(option);

        this.version = option.version;
        this.defaultPrefix = option.prefix || "$";
        this.prefixes = new Map<Snowflake, string>();

        this.owners = option.owners || [];
        this.managers = option.managers || [];

        this.messageCommands = new Map();
        this.slashCommands = new Map();

        this.db = database;
        this.payOs = payos;

        loadCommands(this);
        loadEvents(this);
        botWebLoader(this)
    }

    public readonly version: string;
    private readonly defaultPrefix: string;
    public readonly prefixes: Map<Snowflake, string>;
    public readonly owners: Snowflake[];
    public readonly managers: Snowflake[];
    public readonly messageCommands: Map<string, BotMessageCommand>;
    public readonly slashCommands: Map<string, BotSlashCommand>;
    public readonly db: QuickDB;
    public readonly payOs: PayOS;

    public async getPrefix(guildID: Snowflake): Promise<string> {
        const prefix = this.prefixes.get(guildID);
        if (prefix) return prefix;

        const dbPrefix = await this.db.get(`${guildID}.prefix`);
        if (!dbPrefix) {
            this.prefixes.set(guildID, this.defaultPrefix);
            return this.defaultPrefix;
        }

        this.prefixes.set(guildID, dbPrefix);
        return dbPrefix;
    }

    public async setPrefix(guildID: Snowflake, prefix: string): Promise<void> {
        this.prefixes.set(guildID, prefix);
        this.db.set(`${guildID}.prefix`, prefix);
    }
}

const bot = new Bot({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds
    ],
    version: "",
    prefix: config.bot.prefix,
    owners: config.bot.owners,
    managers: config.bot.managers
})

bot.login(config.bot.Token)