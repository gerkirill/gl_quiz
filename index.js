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
    let question = users[msg.chat.id].questions.pop();
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

bot.onText(/\/start/, (msg, match) => startQuiz(msg));

bot.on('callback_query', msg => {
    const answer = msg.data.split('_');
    const index = answer[0];
    const variant = parseInt(answer[1]);
    const isCorrect = questions[index].correct === variant;

    if (isCorrect) {
        users[msg.from.id].results++;
    }

    bot.sendMessage(msg.from.id, isCorrect ? 'Ответ верный ✅' : 'Ответ неверный ❌');

    let question = users[msg.from.id].questions.pop();

    setTimeout(() => {
        if (question) {
            ask(msg.from.id, question);
        } else {
            let success = users[msg.from.id].results / questions.length > successPercent;
            let message = success ? 'Поздравляю, покажите результат нашему консультанту ' : 'Получится в другой раз ';
            bot.sendMessage(msg.from.id, message + users[msg.from.id].results + '/' + questions.length);
        }
    }, 1);
});