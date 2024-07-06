import config from "config";
import PayOS from "@payos/node";


export default new PayOS(
    config.SenkoPay.CLID,
    config.SenkoPay.APIKEY,
    config.SenkoPay.CKKEY
);;