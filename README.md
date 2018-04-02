# file-matcher

Search files recursively using globs, file attributes and content match.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/file-matcher.svg)](https://badge.fury.io/js/file-matcher)
[![Build Status](https://travis-ci.org/mauriciovigolo/file-matcher.svg?branch=master)](https://travis-ci.org/mauriciovigolo/file-matcher)
[![Coverage Status](https://coveralls.io/repos/github/mauriciovigolo/file-matcher/badge.svg?branch=master)](https://coveralls.io/github/mauriciovigolo/file-matcher?branch=master)
[![Join the chat at https://gitter.im/mauriciovigolo/file-matcher](https://img.shields.io/gitter/room/mauriciovigolo/file-matcher.svg)](https://gitter.im/mauriciovigolo/file-matcher?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

---

* Possibility to use globs for filename patterns.
* Search by file attributes as modified date, birth date and/or file size, using predicate operators: Equal, NotEqual, GreaterThen, LessThan.
* Optionally it's possible to refine the search by using a RegExp to match the file content.
* FileMatcher inherits from Node's EventEmitter, so it's possible to catch events like entering the search directory, file matched, content match processing ratio.
* Written in Typescript.
* Compatible with ES5 and further.

---

* [About](#about)
* [Installing](#installing)
* [Usage](#usage)
  * [Ecmascript](#ecmascript)
  * [Typescript](#typescript)
  * [Examples](#examples)
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

**Typescript projects:**.

1.  No need to install an apart module for the typescript declarations files (ie.: @types/file-matcher),
    as the source already bundles it's d.ts files.

2.  Insert the following configuration inside the compilerOptions of the project's tsconfig.json file:

```json
"compilerOptions": {
    "lib": [
        "es2015"
    ]
}
```

This will give support for promises and collections features without the need of an external library. This configuration is mandatory for Typescript projects.

### Versions

Recommended to use in:

* Node >= 6
* Ecmascript >= 5
* Typescript >= 2.0.0

# Usage

The find function of filematcher provides the following search options:

* `path` - Path to be searched. ie: './lib/'
* `fileFilter` - options for filtering files, as:
  * `fileNamePattern` - Glob pattern for looking for files - filenames. Example: `['**/*.js']`
  * `attributeFilters` - Array of filters - filter by file attributes like size, birth and modification dates. Example: `js [{ type: AttributeType.Size, value: 10, operator: PredicateOperator.GreaterThan }]`
  * `content` - RegExp to validade file content, ie: `/test/i`
  * `fileReadOptions` - These options will be used in the Node.JS `fs.ReadFile` function. So it has the same options as the original. Example: `{ encoding:'utf8', flag: 'r' }`
* `recursiveSearch` - Tells the finder to search recursively from the given path. This is a boolean attribute, and the default value is false.

The next topics show a simple example on how to use the library in Ecmascript and Typescript.

## Ecmascript

The following search looks for .js files in the /home/user/prjs/ directory, that were
modified between 2016-12-23 and 2016-12-25, and content with "use strict".

```javascript
var fm = require('file-matcher');

var options = {
    path: '/home/user/prjs/',
    recursiveSearch: true,
    fileFilter: {
        fileNamePattern: '**/*.js',
        content: /use strict/i,
        attributeFilters: [
            {
                type: fm.AttributeType.ModifiedDate,
                operator: fm.PredicateOperator.LessThan
                value:  new Date(2016, 11, 25),
            },
            {
                type: fm.AttributeType.ModifiedDate,
                operator: fm.PredicateOperator.GreaterThan
                value:  new Date(2016, 11, 23),
            }
        ]
    }
};

var fileMatcher = new fm.FileMatcher();
fileMatcher.find(options)
    .then(function(files) {
        // ...
    })
    .catch(function(error) {
        // ...
    });
```

## Typescript

The same example, explained above - search to look for .js files in the /home/user/prjs/ directory, that were
modified between 2016-12-23 and 2016-12-25, and content must have "use strict". In Typescript it would be:

```typescript
import { FileMatcher, FindOptions, AttributeType, PredicateOperator } from 'file-matcher';

let options: FindOptions = {
    path: '/home/user/prjs/',
    recursiveSearch: true,
    fileFilter: {
        fileNamePattern: '**/*.js',
        content: /use strict/,
        attributeFilters: [
            {
                type: AttributeType.ModifiedDate,
                operator: PredicateOperator.LessThan
                value:  new Date(2016, 11, 25),
            },
            {
                type: AttributeType.ModifiedDate,
                operator: PredicateOperator.GreaterThan
                value:  new Date(2016, 11, 23),
            }
        ]
    }
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

* `preSearchDirectory` - Emitted on before visiting the directory / subdirectories. Returns the directory.
* `endSearchDirectory` - Search by filename and file attributes was completed. Returns the list and the total of matched files, however be aware that this is not the final list of files if you are also searching for content match.

### Event emmitted while filtering by file content using the regex

* `contentMatch` - Regex matched. Returns the filename and the processed ratio (0 to 1).

## Examples

Checkout the [Github examples repo](https://github.com/mauriciovigolo/file-matcher-examples#README) or go strait to the examples:

* [Basic Search - Ecmascript](https://github.com/mauriciovigolo/file-matcher-examples/tree/master/basic-search-es);
* [Basic Search - Typescript](https://github.com/mauriciovigolo/file-matcher-examples/tree/master/basic-search-ts);
* [Search listening to the library events - Typescript](https://github.com/mauriciovigolo/file-matcher-examples/tree/master/events-search-ts);

# History

For the list of all changes see the [history log](CHANGELOG.md).

# License

Licensed under [MIT](LICENSE.md).

Copyright (c) 2018 Mauricio Gemelli Vigolo and contributors.
