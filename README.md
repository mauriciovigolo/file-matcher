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
* [Getting Started](#)
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


