const fs = require('fs');
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const outputFileIndex = path.join(__dirname, 'project-dist', 'index.html');
const outputFileStyle = path.join(__dirname, 'project-dist', 'style.css');
const outputFolderAssets = path.join(__dirname, 'project-dist', 'assets');

let arr = [];

const EVENT_TYPE = {
  CHANGE: 'change',
  RENAME: 'rename',
};

fs.access(distFolder, fs.constants.F_OK, (error) => {
  if (error) {
    fs.mkdir(distFolder, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
});

updateIndexHtml();
updateStyles();
copyFolder(assetsFolder, outputFolderAssets);

function updateIndexHtml() {
  fs.readFile(templatePath, 'utf8', (error, data) => {
    if (error) {
      console.log(error);

      return;
    }

    fs.readdir(componentsFolder, (error, files) => {
      if (error) {
        console.log(error);
      }

      const htmlFiles = files.filter((file) => path.extname(file) === '.html');

      htmlFiles.forEach((file, index) => {
        const componentName = path.basename(file, '.html');
        const componentPath = path.join(componentsFolder, file);

        fs.readFile(componentPath, 'utf8', (error, componentData) => {
          if (error) {
            console.log(error);
          }

          data = data.replace(
            new RegExp(`{{${componentName}}}`, 'g'),
            componentData,
          );

          if (index === htmlFiles.length - 1) {
            fs.mkdir(
              path.dirname(outputFileIndex),
              { recursive: true },
              (error) => {
                if (error) {
                  console.log(error);

                  return;
                }

                fs.writeFile(outputFileIndex, data, (error) => {
                  if (error) {
                    console.log(error);
                  }
                });
              },
            );
          }
        });
      });
    });
  });
}

function updateStyles() {
  fs.readdir(stylesFolder, (error, files) => {
    if (error) {
      console.log(error);

      return;
    }

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    let countFiles = 0;

    arr.length = 0;

    fs.access(outputFileStyle, fs.constants.F_OK, (error) => {
      if (!error) {
        fs.unlink(outputFileStyle, (error) => {
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

              fs.writeFile(outputFileStyle, fullData, (error) => {
                if (error) {
                  console.log(error);
                }

                fs.rename(
                  outputFileStyle,
                  path.join(__dirname, 'project-dist', 'style.css'),
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

function copyFolder(source, destination) {
  fs.mkdir(destination, { recursive: true }, (error) => {
    if (error) {
      console.log(error);

      return;
    }

    fs.readdir(source, (error, files) => {
      if (error) {
        console.log(error);

        return;
      }

      files.forEach((file) => {
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);

        fs.stat(sourcePath, (error, stats) => {
          if (error) {
            console.log(error);

            return;
          }

          if (stats.isDirectory()) {
            copyFolder(sourcePath, destPath);
          } else {
            fs.copyFile(sourcePath, destPath, (error) => {
              if (error) {
                console.log(error);
              }
            });
          }
        });
      });
    });
  });
}

fs.watch(__dirname, { recursive: true }, (eventType, filename) => {
  if (!filename) return;

  const isHTML = path.extname(filename) === '.html';
  const isCSS = path.extname(filename) === '.css';
  const isTemplates = filename === 'template.html';

  if (filename.startsWith('components/') && isHTML) {
    if (eventType === EVENT_TYPE.CHANGE || eventType === EVENT_TYPE.RENAME) {
      updateIndexHtml();
    }
  }

  if (filename.startsWith('styles/') && isCSS) {
    if (eventType === EVENT_TYPE.CHANGE || eventType === EVENT_TYPE.RENAME) {
      updateStyles();
    }
  }

  if (filename.startsWith('assets/')) {
    if (eventType === EVENT_TYPE.CHANGE || eventType === EVENT_TYPE.RENAME) {
      copyFolder(assetsFolder, outputFolderAssets);
    }
  }

  if (isTemplates && eventType === EVENT_TYPE.CHANGE) {
    updateIndexHtml();
  }
});
