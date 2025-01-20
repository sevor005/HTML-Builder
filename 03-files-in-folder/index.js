const fs = require('fs');
const path = require('path');

const pathToFold = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFold, (error, files) => {
  if (error) {
    console.log('Ошибка при чтении папки:', error);

    return;
  }

  console.log(`Содержимое папки ${path.basename(pathToFold)}:`);

  files.forEach((file) => {
    const name = path.parse(file).name;
    const expansion = path.extname(file).slice(1);

    fs.stat(path.join(pathToFold, file), (error, stats) => {
      if (error) {
        console.log('Ошибка при получении информации о файле:', error);

        return;
      }

      if (stats.isFile()) {
        console.log(`${name} - ${expansion} - ${stats.size}kb`);
      }
    });
  });
});
