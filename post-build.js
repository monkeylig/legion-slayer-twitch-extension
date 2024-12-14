const fs = require('fs');
const path = require('path');

async function removeDir(dirName) {
    const deletePromise = new Promise((resolve, reject) => {
        fs.rmdir(dirName, (err) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve(`Deleted Empty Folder: ${dirName}`);
        });
    });
    return await deletePromise;
}

async function removeFile(fileName) {
    const deletePromise = new Promise((resolve, reject) => {
        fs.unlink(fileName, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                reject(err);
                return;
            }
            resolve(`Deleted file: ${fileName}`);
        })
    });
    return await deletePromise;
}

async function walk(dir) {
    let files = await fs.promises.readdir(dir);
    if (files.length === 0) {
        return await removeDir(dir);
    }
    
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);

        if (file.startsWith('polyfills')) {
            return await removeFile(filePath);
        }

        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if (stats.isFile()) return filePath;
  }));

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

walk('./out')
  .then(files => console.log(files))
  .catch(err => console.error(err));