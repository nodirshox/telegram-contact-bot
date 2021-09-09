require('dotenv').config();
const { Telegraf } = require("telegraf");
const { word } = require("./dictionary");

const bot = new Telegraf(process.env.TOKEN);
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID;

bot.catch((err, ctx) => {
    console.log(`Error on ${ctx.updateType}`, err);
    process.exit(1);
})

bot.start((ctx) => {
    let fullname = ctx.from.last_name ? `${ctx.from.first_name} ${ctx.from.last_name}`: `${ctx.from.first_name}`;
    let introMessage = `<b>${word.uz.hello} ${fullname}.</b>\n\n${word.uz.intro}`;
    let nometaMessage = word.uz.nometa;
    ctx.replyWithHTML(introMessage);
    ctx.replyWithHTML(nometaMessage);
});

bot.on("message", (ctx) => {
    let userID = ctx.from.id;
    let isAdmin = (userID == ADMIN_TELEGRAM_ID) ? true : false;

    if (isAdmin) {
        // sending to specific message to user by admin
        if (ctx.update.message.reply_to_message != undefined && ctx.update.message.reply_to_message.forward_from != undefined) {
            let messageAuthorID = ctx.update.message.reply_to_message.forward_from.id;
            let adminMessage = ctx.update.message.text;
            ctx.telegram.sendMessage(messageAuthorID, adminMessage);
        } else {
            ctx.reply(word.uz.forgetToReply);
        }
    } else {
        // forward message;
        ctx.telegram.forwardMessage(ADMIN_TELEGRAM_ID, userID, ctx.message.message_id);
    };
});

bot.launch(
    {
        webhook: {
            domain: process.env.WEBSITE,
            port: process.env.PORT
        }
    }
);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
