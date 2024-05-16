import superagent from "superagent";
// @ts-ignore (không có type cho module này)
import superagentJsonapify from "superagent-jsonapify";

superagentJsonapify(superagent);

export function secondsToTime(rawSeconds: number, colons?: true, doubleZeroInMinute?: true) {

    const hours = Math.floor(rawSeconds / 3600);
    const minutes = Math.floor((rawSeconds - hours * 3600) / 60);
    const seconds = rawSeconds - hours * 3600 - minutes * 60;

    return (
        (hours > 0 ? `${hours}${colons ? ":" : "giờ "}` : "") +
        (minutes < 10 && doubleZeroInMinute ? "0" : "") +
        minutes +
        (colons ? ":" : "phút ") +
        (seconds < 10 ? "0" : "") +
        seconds +
        (!colons ? "giây" : "")
    );
}

export function thumbnail(id: string, lowQuality: boolean = false) {
    if (lowQuality) return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
    return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export async function getAccessToken(clientId: string, clientSecret: string) {
    const base64AuthString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await superagent
        .post("https://accounts.spotify.com/api/token")
        .set("Authorization", `Basic ${base64AuthString}`)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("grant_type=client_credentials");
    if (response.status === 200) return response.body.access_token;
    else throw new Error(`Lỗi khi truy vấn api`);
}

export async function checkLanguage(text: string) {
    const regex = /[\u3400-\u9FBF]/g; // regex để tìm các ký tự Hán
    return regex.test(text);
}

export async function getUserID(user: string | undefined) {
    if (!user) return;
    let output = user;
    
    if (output.startsWith('<@')) output = output.slice(2, -1);
    if (output.startsWith('!')) output = output.slice(1);
    
    return output;
}

export async function getChannelID(channel: string | undefined) {
    if (!channel) return;
    let output = channel;

    if (output.startsWith('<#')) output = output.slice(2, -1);
    if (output.startsWith('!')) output = output.slice(1);

    return output;
}

export async function formatNumber(number:Number) {
    let numString : string = number.toString();

    if (numString.length > 3) {
        let prats: string[] = [];
        while (numString.length > 3) {
            prats.unshift(numString.slice(-3));
            numString = numString.slice(0, -3);
        }

        prats.unshift(numString);
        let t = prats.join(".");
        return t.startsWith("-") ? t.slice(1) : t
    } else {
        return numString;
    }
}