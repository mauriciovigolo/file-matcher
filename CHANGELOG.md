<a name="1.0.0-rc.1"></a>
# 1.0.0-rc.1 (2016-12-30)

Migration from bitbucket to Github. First release as opensource project.

Features
---
* ***Dependencies change*** - removed async module dependency to start using async/await from typescript. Now the library has only one dependency - micromacth.
* ***Project status*** - coded, tested and production ready, however the version is RC for documenting purposes - to publish the library examples.


<a name="1.0.0-rc.2"></a>
# 1.0.0-rc.2 (2016-12-30)

Features
---
* ***CI*** - Added Travis CI and coveralls.


<a name="1.0.0-rc.3"></a>
# 1.0.0-rc.3 (2016-12-30)

Improving documentation.


<a name="1.0.0-rc.4"></a>
# 1.0.0-rc.4 (2016-12-31)

Improving documentation and examples.

<a name="1.0.0-rc.5"></a>
# 1.0.0-rc.5 (2017-01-01)

Features
---
* ***Events***
    - removed initSearchSubDirectory event as it has a duplicated meaning with preSearchDirectory event.
    - removed endSearchSubDirectory from the docs list of available events to listen as it should be used more internally by the file-matcher API.
    - Changed the return value from endSearchDirectory event. Now is returning the array of matched files (considering the first part of the search - before filtering by file content) and the total of files - number.
* ***Docs*** - Docs improvement.

Bug Fixes
---
* ***contentMatch Event*** - changed to return the processed as percentage and value change.

<a name="1.0.0-rc.6"></a>
# 1.0.0-rc.6 (2017-01-01)

Docs update