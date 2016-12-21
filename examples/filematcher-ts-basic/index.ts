import { FileMatcher, FindOptions } from 'file-matcher';
import * as path from 'path';

let fileMatcher = new FileMatcher();

let dir = path.join(__dirname, '../');

let options: FindOptions = {
    path: dir,
    fileFilter: {
        fileNamePattern: ['**/*.js','!index.js','!node_modules'],
        content: /testdsa/i
    },
    recursiveSearch: true
};

fileMatcher.find(options)
    .then(files => {
        console.log('Found files:', files);
    })
    .catch(error => {
    console.log('An error happened')
});