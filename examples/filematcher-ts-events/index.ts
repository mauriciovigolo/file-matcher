/**
 * @description
 * Will look for files that have the 'use strict' statement in the node_modules folder.
 * This will be done to checkout the available events offered by this library and
 * to have a bigger quantity of files.
 */
import { FileMatcher, FindOptions } from 'file-matcher';
import * as path from 'path';

let fileMatcher = new FileMatcher();

let dir: string = path.resolve(__dirname, '../');

let options: FindOptions = {
    path: dir,
    fileFilter: {
        fileNamePattern: ['node_modules/*.js']
        // content: /use strict/i
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

// Events
fileMatcher.on('preSearchDirectory', dir => {
    console.log('preSearchDirectory: ', dir);
});

fileMatcher.on('initSearchSubDirectory', dir => {
    console.log('initSearchSubDirectory: ', dir);
});