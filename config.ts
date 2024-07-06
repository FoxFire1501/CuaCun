import { ActivityType } from "discord.js"

export default {
    bot: {
        Token: "MTIzOTYzNjE0NTkxNTMwMjAxMA.GriIBH.jnkvWkLB9qNo-GlLu6zDo3WOG5E8SyL8g5RNX8",
        clientID: "",
        clientSecret: "",
        prefix: ".",
        channelErr: "1230821361539219526",
        Status: {
            lab: "",
            type:  ActivityType.Custom,
        },
        Embed: {
            Color: 0x2e2e2e,
            ColorSuccess: 0x2e2e2e
        },
        owners: ['1195381172549722204', '1099044499474370670'],
        managers: [ '1138103980489195581', '1200463456747409518', '1226524610649133218' ]
    },
    Routes: {
        host: "localhost",
        port: 8080,
        api: "http://localhost:8080/api",
        insecure: true
    },
    link: {
        discordSV: "https://discord.gg/cunstore"
    },
    emojis: {
        error: "<:utility8:1236740914823827466>",
        success: "<:utility12:1236740916761333932>",
        mb: "<:cun_mbbank:1109066410472247378>",
        momo: "<:cun_momo:1109066426200903730>",
        cardvip: "<:cun_cardvip:1109066174127419502>",
        timo: "<:cun_timo:1237784531994677320>",
        join: "<:3199blurplejoin:1240370277943087154>",
        leave: "<:blurple_leave:1240370276265623602>"
    },
    SenkoPay: {
        CLID: "bfd82b8d-0ebe-4b13-bb6c-62ebec364375",
        APIKEY: "bbca99b1-34e0-4660-b5a1-37471376d338",
        CKKEY: "ac0b2a7c6d23097cfb28ad05c2331529104ae28304413a66ce36786817b68c5f"
    }
}