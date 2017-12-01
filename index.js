const config = require('./config.js');
const successPercent = config.successPercent || 0.7;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.botToken, {polling: true});

let users = {};

let questions = [
    {
        title:'Сколько параметров можно передать функции ?',
        variants: [
            [{ text: 'Ровно столько, сколько указано в определении функции.', callback_data: '0_1' }],
            [{ text: 'Сколько указано в определении функции или меньше.', callback_data: '0_2' }],
            [{ text: 'Сколько указано в определении функции или больше.', callback_data: '0_3' }],
            [{ text: 'Любое количество.', callback_data: '0_4' }]
        ],
        correct: 4
    },
    {
        title:'Чему равна переменная name?\nvar name = "пупкин".replace("п", "д")',
        variants: [
            [{ text: 'дудкин', callback_data: '1_1' }],
            [{ text: 'дупкин', callback_data: '1_2' }],
            [{ text: 'пупкин', callback_data: '1_3' }],
            [{ text: 'ляпкин-тяпкин', callback_data: '1_4' }]
        ],
        correct: 2
    },
    {
        title:'Чему равно 0 || "" || 2 || true ?',
        variants: [
            [{ text: '0', callback_data: '2_1' }],
            [{ text: '""', callback_data: '2_2' }],
            [{ text: '2', callback_data: '2_3' }],
            [{ text: 'true', callback_data: '2_4' }]
        ],
        correct: 3
    },
];

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

    if (question) {
        ask(msg.from.id, question);
    } else {
        let success = users[msg.from.id].results / questions.length > successPercent;
        let message = success ? 'Поздравляю, покажите результат нашему консультанту ' : 'Получится в другой раз ';
        bot.sendMessage(msg.from.id, message + users[msg.from.id].results + '/' + questions.length);
    }
});