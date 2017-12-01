module.exports = [
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
