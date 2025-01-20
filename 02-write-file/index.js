const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeFile = (text) => {
  fs.appendFile(path.join(__dirname, 'text.txt'), `${text}\n`, (error) => {
    if (error) {
      console.log('Ошибка при записи сообщения в файл: ', error);
    }
  });
};

console.log(`
  Введите сообщение для записи в файл. Для завершения напишите "exit" или нажмите Ctrl+C.
`);

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('До встречи!');

    rl.close();
  } else {
    writeFile(input);

    console.log('Ваше сообщение записано в файл. Введите новое сообщение.');
  }
});

rl.on('SIGINT', () => {
  console.log('До свидания!');

  rl.close();
});
