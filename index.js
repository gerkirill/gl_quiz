const config = require('./config.js');
const successPercent = config.successPercent || 0.7;
const TelegramBot = require('node-telegram-bot-api');
const questions = require('./questions.js');
const bot = new TelegramBot(config.botToken, {polling: true});

let users = {};

function startQuiz(msg){
    users[msg.chat.id] = {
        questions: JSON.parse(JSON.stringify(questions)),
        results: 0
    };
    bot.sendMessage(msg.chat.id, `Привет 👋 Хочешь узнать о GlobalLogic такое, что не каждому расскажет HR? 😉 
Пройди этот квиз, угадай правильные ответы на вопросы, и если повезет - получишь приз 🎁`);
    let question = users[msg.chat.id].questions.shift();
    ask(msg.chat.id, question);
}

function ask(chat, question) {
    let options = {
        reply_markup: JSON.stringify({
            inline_keyboard: question.variants,
        })
    };
    bot.sendMessage(chat, question.title, options);
}

bot.onText(/\/(re)?start/, (msg, match) => startQuiz(msg));

bot.on('callback_query', msg => {
    if (!users[msg.from.id]) {
        return;
    }
    const answer = msg.data.split('_');
    const index = answer[0];
    const variant = parseInt(answer[1]);
    const isCorrect = questions[index].correct === variant;

    if (isCorrect) {
        users[msg.from.id].results++;
    }

    bot.sendMessage(msg.from.id, isCorrect ? '✅ Правильно' : '❌ Неправильно');

    let question = users[msg.from.id].questions.shift();

    setTimeout(() => {
        if (question) {
            ask(msg.from.id, question);
        } else {
            let success = users[msg.from.id].results / questions.length > successPercent;
            let message = success
              ? '🤘Отлично🤘 Покажи результат нашему консультанту и получи приз 🎁'
              : '👍 Неплохо. Но на приз не тянет 😉 Нажми /start чтобы попробовать еще раз.';
            bot.sendMessage(msg.from.id, `${users[msg.from.id].results} из ${questions.length}! ${message}`);
            delete users[msg.from.id];
        }
    }, 500);
});
