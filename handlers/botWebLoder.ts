import Bot from "bot";
import express from "express";
import DiscordOauth2 from "discord-oauth2"
import { DiscordAuthorization } from "discord-authorize"


const app = express();
const oauth = new DiscordAuthorization({
   clientId: "1239636145915302010",
	clientSecret: "Be5LMoCvwlmBB6RF59T-HxsQyMpyY55F",
	redirectUri: "http://127.0.0.1:5500/login",
})

export default async function botWebLoader(client: Bot) {
    app.use(express.static('public'))

   app.get('/cancelUrl', function (req, res) {
      res.send('Đã Hủy Đơn Hàng');
      const payData = req.url.split("&")
      const statusPay = payData.filter(s => s.includes("status")).join("").split("=")[1]
      console.log(statusPay)
   })
   app.get('/returnUrl', function (req, res) {
      res.send('Thanh Toán Thành Công');
      const payData = req.url.split("&")
      const statusPay = payData.filter(s => s.includes("status")).join("").split("=")[1]
      console.log(statusPay)
   })
   app.get('/login',async function (req, res) {
   const code = req.query.code as string;
   const token = await oauth.exchangeCodeForTokens(code)
   oauth.setAccessToken(token.accessToken)
   oauth.setRefreshToken(token.refreshToken)

   console.log(await oauth.getMyInfo())

   res.redirect("/dashboard")
   })
    
    app.listen(5500)
}