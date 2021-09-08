require('dotenv').config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKEN);
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID;

bot.start((ctx) => {
    let fullname = ctx.from.last_name ? `${ctx.from.first_name} ${ctx.from.last_name}`: `${ctx.from.first_name}`;
    let introMessage = `
<b>👋 Assalomu alaykum ${fullname}.</b>\n
Savolingizni yozing. Tez orada javob beraman.\n
Rahmat!
    `;
    let nometaMessage = "🙏 Iltimos, bitta xabarda barcha xabaringizni yozing.<a href='https://files.nodirbek.uz/Nometa.png'>&#8203;</a>"; 
    ctx.replyWithHTML(introMessage);
    ctx.replyWithHTML(nometaMessage);
});

bot.on("message", (ctx) => {
    let userID = ctx.from.id;
    let isAdmin = (userID == ADMIN_TELEGRAM_ID) ? true : false;

    if (isAdmin) {
        // sending to specific message to user by admin
        if (ctx.update.message.reply_to_message) {
            let messageAuthorID = ctx.update.message.reply_to_message.forward_from.id;
            let adminMessage = ctx.update.message.text;
            ctx.telegram.sendMessage(messageAuthorID, adminMessage);
        } else {
            ctx.reply("Xabarni \"reply\" qilishni unitdingiz.");
        }
    } else {
        // forward message;
        ctx.telegram.forwardMessage(ADMIN_TELEGRAM_ID, userID, ctx.message.message_id);
    };
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));