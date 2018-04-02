<a name="1.3.0"></a>

# 1.3.0 (2017-04-02)

This release includes:

* Dependencies version update.
* Updated the project documentation.
* Fixed the parameter passed to micromatch as array.

<a name="1.2.0"></a>

# 1.2.0 (2017-03-14)

This release includes:

* PR's #3 and #2. Special thanks to @vindu939 and snyk.
* Changes in build script, including npx and shx (better os interoperability)

<a name="1.1.0"></a>

# 1.1.0 (2017-03-20)

Fix for issue #1 and documentation improvement.

<a name="1.0.0"></a>

# 1.0.0 (2017-01-02)

Official release milestone.

<a name="1.0.0-rc.7"></a>

# 1.0.0-rc.7 (2017-01-02)

## Features

* **_contentMatch Event_** - changed to return the processed from percentage to ratio.

<a name="1.0.0-rc.6"></a>

# 1.0.0-rc.6 (2017-01-01)

Docs update

<a name="1.0.0-rc.5"></a>

# 1.0.0-rc.5 (2017-01-01)

## Features

* **_Events_**
  * removed initSearchSubDirectory event as it has a duplicated meaning with preSearchDirectory event.
  * removed endSearchSubDirectory from the docs list of available events to listen as it should be used more internally by the file-matcher API.
  * Changed the return value from endSearchDirectory event. Now is returning the array of matched files (considering the first part of the search - before filtering by file content) and the total of files - number.
* **_Docs_** - Docs improvement.

## Bug Fixes

* **_contentMatch Event_** - changed to return the processed as percentage and value change.

<a name="1.0.0-rc.4"></a>

# 1.0.0-rc.4 (2016-12-31)

Improving documentation and examples.

<a name="1.0.0-rc.3"></a>

# 1.0.0-rc.3 (2016-12-30)

Improving documentation.

<a name="1.0.0-rc.2"></a>

# 1.0.0-rc.2 (2016-12-30)

## Features

* **_CI_** - Added Travis CI and coveralls.

<a name="1.0.0-rc.1"></a>

# 1.0.0-rc.1 (2016-12-30)

Migration from bitbucket to Github. First release as opensource project.

## Features

* **_Dependencies change_** - removed async module dependency to start using async/await from typescript. Now the library has only one dependency - micromacth.
* **_Project status_** - coded, tested and production ready, however the version is RC for documenting purposes - to publish the library examples.
