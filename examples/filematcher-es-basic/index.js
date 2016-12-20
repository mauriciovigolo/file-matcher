/**
 *
 */
'use strict';

var fm = require('file-matcher');
var path = require('path');

var fileMatcher = new fm.FileMatcher();

var dir = path.join(__dirname, '../');

var options = {
    path: dir,
    fileFilter: {
        fileNamePattern: ['**/*.js','!index.js','!node_modules'],
        content: /testdsa/i
    },
    recursiveSearch: true
};

fileMatcher.find(options)
    .then(foundFiles)
    .catch(errorHandler);


function foundFiles(files) {
    console.log('Found files:', files);
}

function errorHandler(error) {
    console.log('An error happened');
}