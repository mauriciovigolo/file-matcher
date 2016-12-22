file-matcher
=====================
:rocket: Search files recursively using globs, file attributes and content match.


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
* [History](#)
* [License](#)

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


# Usage

The find function of filematcher provides the following search options:

* `path` -  Path to be searched. ie: './lib/'
* `fileFilter` -  options for filtering files, as:
    - `fileNamePattern` - Glob pattern for looking for files - filenames. Example: ```js ['**/*.js'] ```
    - `attributeFilters` - Array of filters - filter by file attributes like size, birth and modification dates. Example: ```js [{ type: AttributeType.Size, value: 10, operator: PredicateOperator.GreaterThan }] ```
    - `content` - RegExp to validade file content, ie: ```js /test/i ```
    - `fileReadOptions` - These options will be used in the Node.JS `fs.ReadFile` function. So it has the same options as the original. Example: ```js { encoding:'utf8', flag: 'r' }```
* `recursiveSearch` - Tells the finder to search recursively from the given path. This is a boolean attribute, and the default value is false.

The next topics show a simple example on how to use the library in Ecmascript and Typescript.


## Ecmascript

The following search looks for .js files in the /home/user/prjs/ directory, that were
modified between 2016-12-23 and 2016-12-25, and the file content must have "use strict".

``` js

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

``` ts
import { FileMatcher, FindOptions } from 'file-matcher';

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
TODO: insert the library events list.

## Examples
Check out the examples available in

# History
For the list of all changes see the history log.

# License

Copyright (c) 2016 Mauricio Gemelli Vigolo <mgv@tisatec.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.