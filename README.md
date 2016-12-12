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
    - [Ecmascript](#)
    - [Typescript](#)
* [Documentation](#)
    - [Examples](#)
    - [File-Matcher API](#)
* [History](#)
* [License](#)

---


# About

This module offers assynchronous file search, by filename, file attributes and content. The search could be recursive or not. The difference
between other similar implementations, is that it's possible to use a group of filters in conjunction to filename glob patterns and regex
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
* `filters` -  options for filtering files, as:
    - `pattern` - Glob pattern for looking for files - filenames. Example: `['**/*.js']`
    - `size` - File size in bytes. Example: `{ value: 10, operator: PredicateOperator.Equal }`
    - `modifiedTime` - Last modification date. Example: `{ value: new Date(2011,2,17), operator: PredicateOperator.GreaterThan }`
    - `birthTime` - Date of creation of the file. Example: `{ value: new Date(2011,2,17), operator: PredicateOperator.LessThan }`
* `content` - RegExp to validade file content, ie: `/test/i`
* `fileReadOptions` - These options will be used in the Node.JS `fs.ReadFile` function. So it has the same options as the original. Example: `{ encoding:'utf8', flag: 'r' }`.
* `recursiveSearch` - Tells the finder to search recursively from the given path. This is a boolean attribute, and the default value is false.

After initializing the search object, it's only needed to pass it to the find function. Example:
``` js
var fileMatcher = new FileMatcher();
fileMatcher.find(options)
    .then(function(files) {
        // ...
    })
    .catch(function(error)=> {
        // ...
    });
```
The result will be a promise, resolving the matched files.

As FileMatcher extends Node's EventEmitter ...

## Ecmascript

``` js
var fileMatcher = require('file-matcher');

var options = {

}

```