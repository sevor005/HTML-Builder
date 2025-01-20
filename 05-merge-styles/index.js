const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'bundle.css');

let arr = [];

function updateBandle() {
  fs.readdir(stylesFolder, (error, files) => {
    if (error) {
      console.log(error);

      return;
    }

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    let countFiles = 0;
    arr.length = 0;

    fs.access(bundleFile, fs.constants.F_OK, (error) => {
      if (!error) {
        fs.unlink(bundleFile, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });

    cssFiles.forEach((file) => {
      const sourcePath = path.join(stylesFolder, file);

      fs.stat(sourcePath, (error, stats) => {
        if (error) {
          console.log(error);
        }

        if (stats.isFile()) {
          fs.readFile(sourcePath, 'utf8', (error, data) => {
            if (error) {
              console.log(error);

              return;
            }

            arr.push(data.trim());
            countFiles++;

            if (countFiles === cssFiles.length) {
              const fullData = arr.join('\n');

              fs.writeFile(bundleFile, fullData, (error) => {
                if (error) {
                  console.log(error);
                }

                fs.rename(
                  bundleFile,
                  path.join(__dirname, 'project-dist', 'bundle.css'),
                  (error) => {
                    if (error) {
                      console.log(error);
                    }
                  },
                );
              });
            }
          });
        }
      });
    });
  });
}

updateBandle();

fs.watch(stylesFolder, (eventType, filename) => {
  if (filename && path.extname(filename) === '.css') {
    if (eventType === 'change' || eventType === 'rename') {
      updateBandle();
    }
  }
});
