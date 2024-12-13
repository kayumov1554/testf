import logging
import openai
from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    filters
)

# Loggingni faollashtirish
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# OpenAI API kaliti
openai.api_key = "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"

# OpenAI funksiyasi
def get_openai_response(user_input):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=user_input,
            max_tokens=150,
        )
        return response["choices"][0]["text"].strip()
    except Exception as e:
        logger.error(f"OpenAI so'rovida xato yuz berdi: {e}")
        return "Uzr, biror narsa noto'g'ri bo'ldi. Iltimos, yana urinib ko'ring."

# /start komandasi
async def start(update: Update, context):
    await update.message.reply_text("Salom! Sizga qanday yordam bera olishim mumkin?")

# Xabarni qayta ishlash
async def handle_message(update: Update, context):
    user_message = update.message.text
    bot_response = get_openai_response(user_message)
    await update.message.reply_text(bot_response)

# Asosiy funksiya
async def main():
    # Telegram bot API tokeni
    application = ApplicationBuilder().token("7865907989:AAERJhsDzhelNvhR6RLS8434RNAjtVY7DK4").build()

    # Handlerlarni qo'shish
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Botni ishga tushirish
    logger.info("Bot ishga tushmoqda...")
    await application.run_polling()

if __name__ == "main":
    import asyncio

    asyncio.run(main())


# .api_key = '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'

# # Telegram bot API tokenini o'rnating
# TELEGRAM_API_TOKEN = '7865907989:AAERJhsDzhelNvhR6RLS8434RNAjtVY7DK4'
