// server.js
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME; // masalan: @hisobotlar

// Express — Render uchun
app.get('/', (req, res) => {
  res.send('Bot ishlayapti ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server ${PORT} portda ishlayapti`);
});

// Telegram bot — POLLING
const bot = new TelegramBot(TOKEN, { polling: true });

const PRICES = {
  klipsa: 0.43,
  ud_pasinok: 0.48,
  narmirovka: 0.32,
  ud_list: 0.54
};

let sessions = {};

function getSession(chatId) {
  if (!sessions[chatId]) {
    sessions[chatId] = { step: null, data: {} };
  }
  return sessions[chatId];
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || '';

  sessions[chatId] = { step: null, data: {} };

  bot.sendMessage(chatId, `Salom, ${name} 👋\nIsh turini tanlang:`, {
    reply_markup: {
      keyboard: [[{ text: '➕ Qo‘shish' }]],
      resize_keyboard: true
    }
  });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text || text === '/start') return;

  const session = getSession(chatId);

  if (text === '➕ Qo‘shish') {
    bot.sendMessage(chatId, 'Ish turini tanlang:', {
      reply_markup: {
        keyboard: [
          [{ text: 'Клипса' }, { text: 'Уд-пасинков' }],
          [{ text: 'Нармировка' }, { text: 'Уд-лист' }],
          [{ text: '✅ Tayyor' }]
        ],
        resize_keyboard: true
      }
    });
    return;
  }

  const map = {
    'Клипса': 'klipsa',
    'Уд-пасинков': 'ud_pasinok',
    'Нармировка': 'narmirovka',
    'Уд-лист': 'ud_list'
  };

  if (map[text]) {
    session.step = map[text];
    bot.sendMessage(chatId, `${text} uchun son kiriting:`);
    return;
  }

  if (session.step && !isNaN(text)) {
    const qty = Number(text);
    const type = session.step;

    if (!session.data[type]) session.data[type] = 0;
    session.data[type] += qty;
    session.step = null;

    bot.sendMessage(chatId, '✅ Saqlandi. Yana qo‘shishingiz yoki Tayyor tugmasini bosishingiz mumkin.');
    return;
  }

if (text === '✅ Tayyor') {
    let report = '📄 HISOBOT\n\n';
    let total = 0;

    for (const key in session.data) {
      const qty = session.data[key];
      const sum = qty * PRICES[key];
      total += sum;

      report += `${key} — ${qty} x ${PRICES[key]} = ${sum.toFixed(2)}\n`;
    }else if 
  (text === '✅ Tayyor'){
    return;
  }
    

    report += `\n💰 Jami: ${total.toFixed(2)}`;

    bot.sendMessage(chatId, report);

    if (CHANNEL_USERNAME) {
      bot.sendMessage(CHANNEL_USERNAME, report);
    }

    sessions[chatId] = { step: null, data: {} };
    return;
  }
});
