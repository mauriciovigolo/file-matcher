file-matcher
=====================
Search files recursively using globs, file attributes and content match.


[![Build Status](https://travis-ci.org/mauriciovigolo/file-matcher.svg?branch=master)](https://travis-ci.org/mauriciovigolo/file-matcher)
[![Coverage Status](https://coveralls.io/repos/github/mauriciovigolo/file-matcher/badge.svg?branch=master)](https://coveralls.io/github/mauriciovigolo/file-matcher?branch=master)
[![Join the chat at https://gitter.im/mauriciovigolo/file-matcher](https://img.shields.io/gitter/room/mauriciovigolo/file-matcher.svg)](https://gitter.im/mauriciovigolo/file-matcher?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

---

* Possibility to use globs for filename patterns.
* Search by file attributes as modified date, birth date and/or file size, using predicate operators: Equal, NotEqual, GreaterThen, LessThan.
* Optionally it's possible to refine the search by using a RegExp to match the file content.
* FileMatcher inherits from Node's EventEmitter, so it's possible to catch events like entering the search directory, file matched, content match processing percentage.
* Written in Typescript.
* Compatible with ES5 and further.

---

* [About](#about)
* [Installing](#installing)
* [Usage](#usage)
    - [Ecmascript](#ecmascript)
    - [Typescript](#typescript)
    - [Examples](#examples)
* [History](#history)
* [License](#license)

---


# About

This module offers assynchronous file search by filename, file attributes and content. The search could be recursive or not. The difference
from other similar implementations, is that it's possible to use a group of filters in conjunction to filename glob patterns and regex
for file contents, refining the search.

The result is a promise, resolved with an array of filenames that matched the criteria.


# Installing

```
$ npm i --save file-matcher
```
**Typescript projects:**. No need to install an apart module for the typescript declarations files (ie.: @types/file-matcher),
as the source already bundles it's d.ts files.

### Versions
Recommended to use in:
- Node >= 6
- Ecmascript >= 5
- Typescript >= 2.0.0


# Usage

The find function of filematcher provides the following search options:

* `path` -  Path to be searched. ie: './lib/'
* `fileFilter` -  options for filtering files, as:
    - `fileNamePattern` - Glob pattern for looking for files - filenames. Example: ```['**/*.js'] ```
    - `attributeFilters` - Array of filters - filter by file attributes like size, birth and modification dates. Example: ```js [{ type: AttributeType.Size, value: 10, operator: PredicateOperator.GreaterThan }] ```
    - `content` - RegExp to validade file content, ie: ```/test/i ```
    - `fileReadOptions` - These options will be used in the Node.JS `fs.ReadFile` function. So it has the same options as the original. Example: ```{ encoding:'utf8', flag: 'r' }```
* `recursiveSearch` - Tells the finder to search recursively from the given path. This is a boolean attribute, and the default value is false.

The next topics show a simple example on how to use the library in Ecmascript and Typescript.


## Ecmascript

The following search looks for .js files in the /home/user/prjs/ directory, that were
modified between 2016-12-23 and 2016-12-25, and the file content must have "use strict".


``` javascript

var fm = require('file-matcher');

var options = {
    path: '/home/user/prjs/'
    fileNamePattern: '[**/*.js]',
    attributeFilter: [
        {
            type: AttributeType.ModifiedDate,
            value:  new Date(2016, 11, 25),
            operator: PredicateOperator.LessThan
        },
        {
            type: AttributeType.ModifiedDate,
            value:  new Date(2016, 11, 23),
            operator: PredicateOperator.GreaterThan
        },
    ],
    content: /use strict/i
};

var fileMatcher = new fm.FileMatcher();
fileMatcher.find(options)
    .then(function(files) {
        // ...
    })
    .catch(function(error)=> {
        // ...
    });
```


## Typescript

The same example, explained above - search to look for .js files in the /home/user/prjs/ directory, that were
modified between 2016-12-23 and 2016-12-25, and the file content must have "use strict", in Typescript could
be:


``` typescript
import { FileMatcher, FindOptions, AttributeType, PredicateOperator } from 'file-matcher';

let options: FindOptions = {
    path: '/home/user/prjs/'
    fileNamePattern: '[**/*.js]',
    attributeFilter: [
        {
            type: AttributeType.ModifiedDate,
            value:  new Date(2016, 11, 25),
            operator: PredicateOperator.LessThan
        },
        {
            type: AttributeType.ModifiedDate,
            value:  new Date(2016, 11, 23),
            operator: PredicateOperator.GreaterThan
        },
    ],
    content: /use strict/i
};

let fileMatcher = new FileMatcher();
fileMatcher.find(options)
    .then(files => {
        // ...
    })
    .catch(error => {
        // ...
    });

```


## Events
The file-matcher module starts to look for files using the filename glob and filter attributes. The result of this search is a list with the matching files. The next step is to filter by file content, using the RegExp. If there isn't a RegExp to validate, then the library will return the list of files that were found initially.

During the file search, the following events are emitted:
### Events emmitted while filtering by filename and file attributes:
* `preSearchDirectory` - Root directory is visited and the search is beginning. Returns the directory.
* `initSearchSubDirectory` - Emitted when the search is recursive and the search execution is starting to looking for files in a new subdirectory. Returns the subdirectory.
* `endSearchSubDirectory` - The search inside a subdirectory was completed. Returns the parent dir and the promise resolve. Don't mess this promise resolve, otherwise you search could not continue.
* `endSearchDirectory` - Search by filename and file attributes was completed. Returns the directory name and the total of found files.
### Event emmitted while filtering by file content using the regex
* `contentMatch` - Regex matched. Returns the filename and the percentage processed.


## Examples
* [Basic Search - Ecmascript];
* [Basic Search - Typescript];
* [Search listening to the library events - Typescript];


# History
For the list of all changes see the [history log](CHANGELOG.md).


# License

Licensed under [MIT](LICENSE.md).

Copyright (c) 2016 Mauricio Gemelli Vigolo <mauriciovigolo@gmail.com>


[Basic Search - Ecmascript]: https://github.com/mauriciovigolo/file-matcher-examples/file-matcher-basic-es#README
[Basic Search - Typescript]: https://github.com/mauriciovigolo/file-matcher-examples/file-matcher-basic-ts#README
[Search listening to the libraries Events - Typescript]: https://github.com/mauriciovigolo/file-matcher-examples/file-matcher-events#README