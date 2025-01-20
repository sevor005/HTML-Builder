const fs = require('fs');
const path = require('path');

const copyFolder = path.join(__dirname, 'files-copy');
const filesFolder = path.join(__dirname, 'files');

fs.access(copyFolder, fs.constants.F_OK, (error) => {
  if (error) {
    fs.mkdir(copyFolder, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
});

fs.readdir(filesFolder, (error, files) => {
  if (error) {
    console.log(error);

    return;
  }

  files.forEach((file) => {
    const sourcePath = path.join(filesFolder, file);
    const copyPath = path.join(copyFolder, file);

    fs.copyFile(sourcePath, copyPath, (error) => {
      if (error) {
        console.log(error);
      }
    });
  });
});

fs.watch(filesFolder, (eventType, filename) => {
  if (filename) {
    const sourcePath = path.join(filesFolder, filename);
    const copyPath = path.join(copyFolder, filename);

    if (eventType === 'change' || eventType === 'rename') {
      fs.access(sourcePath, fs.constants.F_OK, (error) => {
        if (error) {
          fs.unlink(copyPath, (error) => {
            if (error) {
              console.log(error);
            }
          });
        } else {
          fs.copyFile(sourcePath, copyPath, (error) => {
            if (error) {
              console.log(error);
            }
          });
        }
      });
    }
  }
});
