const fs = require('fs');

fs.readFile('01-read-file/text.txt', 'utf8', (error, data) => {
  if (error) {
    console.log('Ошибка при чтении файла: ', error);

    return;
  }

  console.log(data);
});
