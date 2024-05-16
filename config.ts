import { ActivityType } from "discord.js"

export default {
    bot: {
        Token: "MTIyNjU0MDEwMzgyOTI5NTExNQ.G94j6S.55cN93CWzS1yy97kBptzBFxYwd5VzshOG2-Hq0",
        clientID: "",
        clientSecret: "",
        prefix: "t.",
        channelErr: "1230821361539219526",
        Status: {
            lab: "",
            type:  ActivityType.Watching,
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
    }
}