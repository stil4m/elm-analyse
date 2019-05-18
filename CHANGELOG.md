# elm-analyse changelog

## 0.16.4 (2019-05-18)

* More flexibility in the analysis process to support language servers.

## 0.16.3 (2019-04-10)

* Fix navigation issue on dashboard of server mode. Url was not updated properly.

## 0.16.2 (2019-03-26)

* Resolve some security vulnerabilities

## 0.16.1 (2019-01-05)

* [Issue #186](https://github.com/stil4m/elm-analyse/issues/186) Fix for security vulnerability. Thanks to @decioferreira.


## 0.16.0 (2018-12-27)

* Elm 0.19 support. `elm-analyse` can now be used to analyse Elm code written for version `0.19`. Prior versions of Elm are no longer supported.
* [Issue #178](https://github.com/stil4m/elm-analyse/issues/178) Parent folders not resolved properly.
* [PR #174](https://github.com/stil4m/elm-analyse/pull/174) Fix for content overlow. Thanks to @jhrcek.


## 0.15.0 (2018-07-29)

* [Issue #152](https://github.com/stil4m/elm-analyse/issues/152) Covered some performance concerns
* [Issue #171](https://github.com/stil4m/elm-analyse/issues/171) Add message file to dialog in server mode. Thanks to @andys8
* [Issue #160](https://github.com/stil4m/elm-analyse/issues/160) Fix out of memory crash
* [Issue #158](https://github.com/stil4m/elm-analyse/issues/158) Remove 'formatted' check. Please use elm-format.
* [Issue #162](https://github.com/stil4m/elm-analyse/issues/162) Add option to open browser when starting in server mode. Thanks to @romariolopezc
* Bump elm-syntax to 5.0.1 which resolves #165 and #167




## 0.14.1 (2018-04-16)

* [Issue #159](https://github.com/stil4m/elm-analyse/issues/159) Bug: elm-lang/core reported as unused dependency in basic Elm program

## 0.14.0 (2018-04-14)

* [Issue #131](https://github.com/stil4m/elm-analyse/issues/131) New Check: Do not map `Nothing` to `Nothing`.
* [Issue #130](https://github.com/stil4m/elm-analyse/issues/130) New Check: Do not use booleans in case-expressions.
* [Issue #153](https://github.com/stil4m/elm-analyse/issues/153) New Check: Unused value constructor in module
* [Issue #142](https://github.com/stil4m/elm-analyse/issues/142) Top importers / top importees sorting is mixed up. Thanks to @adeschamps.
* [Issue #137](https://github.com/stil4m/elm-analyse/issues/137) Unit test for documentation
* [Issue #141](https://github.com/stil4m/elm-analyse/issues/141) Eliminate duplication among fixers such as 'incompatible data'.
* [Issue #147](https://github.com/stil4m/elm-analyse/issues/147) Remove deprecated dependency elm-css-frameworks. Thanks to @adeschamps.
* [Issue #154](https://github.com/stil4m/elm-analyse/issues/154) Bug: False positives among single field records.
* [Issue #156](https://github.com/stil4m/elm-analyse/issues/156) Bug: Multiline comments not parsable in front of expression
* [PR #140](https://github.com/stil4m/elm-analyse/pull/140) Autofix: Cons of item and literal list. Thanks to @adeschamps.
* [PR #138](https://github.com/stil4m/elm-analyse/pull/138) Autofix: Prefix operator without curry-ing it. Thanks to @adeschamps.

## 0.13.3 (2017-12-22)

* [Issue #132](https://github.com/stil4m/elm-analyse/issues/132) Elm format service fails when output is no JSON or when no files are detected.
* [Issue #134](https://github.com/stil4m/elm-analyse/issues/134) Fix bug on grouping messages by type in UI

## 0.13.2 (2017-12-14)

* [Issue #129](https://github.com/stil4m/elm-analyse/issues/129) No file name in standard output

## 0.13.1 (2017-12-10)

Fix missing dependency.

## 0.13.0 (2017-12-10)

* [Issue #128](https://github.com/stil4m/elm-analyse/issues/128) Drop line length check
* [Issue #123](https://github.com/stil4m/elm-analyse/issues/123) Better documentation about output formats
* [Issue #127](https://github.com/stil4m/elm-analyse/issues/127) Cache elm-format results
* [Issue #126](https://github.com/stil4m/elm-analyse/issues/126) Bump elm-syntax to v3.X.X
* [Issue #119](https://github.com/stil4m/elm-analyse/issues/119) Add dependency information to client
* [Issue #107](https://github.com/stil4m/elm-analyse/issues/107) Detect Unused Packages.
* [PR #122](https://github.com/stil4m/elm-analyse/pull/122) Docs: Fix typo, split installation commands. Thanks to @brasilikum
* [PR #114](https://github.com/stil4m/elm-analyse/pull/114) Improve log messages by adding missing spaces. Thanks to @andys8
* [PR #120](https://github.com/stil4m/elm-analyse/pull/120) Group messages in front-end by file or type. Thanks to @stejanse



## 0.12.1 (2017-11-06)

Fix help message (`elm-analyse --help`)

## 0.12.0 (2017-11-06)

Due to #102 there is a breaking change in the data format of the checks. Things such as editor integration or CI integration could break when upgrading to this version.

* [Issue #102](https://github.com/stil4m/elm-analyse/issues/102) Make CLI output machine parsable
* [Issue #103](https://github.com/stil4m/elm-analyse/issues/103) Add line numbers to 'LineLengthExceeded' check.
* [Issue #104](https://github.com/stil4m/elm-analyse/issues/104) Link to docs for all supported checks.
* [Issue #108](https://github.com/stil4m/elm-analyse/issues/108) Fix grammar errors in check description
* [Issue #109](https://github.com/stil4m/elm-analyse/issues/109) Change wording for 'No Uncurried Prefix' check
* [PR #110](https://github.com/stil4m/elm-analyse/issues/110) Fix grammar errors in check description. Thanks to [@Ruudieboy](https://github.com/Ruudieboy)
* [PR #111](https://github.com/stil4m/elm-analyse/issues/111) Better readable human readable CLI output. Thanks to [@andys8](https://github.com/andys8)
* [Issue #112](https://github.com/stil4m/elm-analyse/issues/112) Duplicate imports break module graph rendering

## 0.11.0 (2017-08-05)

* [Issue #52](https://github.com/stil4m/elm-analyse/issues/52) Checks: Check comments for words that should not be there
* [Issue #91](https://github.com/stil4m/elm-analyse/issues/91) Fixers: Auto-fix MultiLineRecordFormatting
* [Issue #96](https://github.com/stil4m/elm-analyse/issues/96) Bug: (!!) recognised as a used function
* [Issue #97](https://github.com/stil4m/elm-analyse/issues/97) Checks: Duplicate field updates in record update syntax
* [Issue #98](https://github.com/stil4m/elm-analyse/issues/98) Apply elm-format 0.7.0
* [Issue #99](https://github.com/stil4m/elm-analyse/issues/99) Bump elm-test to 4.X.X.


## 0.10.0 (2017-08-03)

* [Issue #82](https://github.com/stil4m/elm-analyse/issues/82) Setup documentation with GitHub Pages
* [Issue #84](https://github.com/stil4m/elm-analyse/issues/84) Websocket connection error (Editor integration)
* [Issue #90](https://github.com/stil4m/elm-analyse/issues/90) Check: Single field records

## 0.9.5 (2017-07-26)

* [PR #95](https://github.com/stil4m/elm-analyse/pull/95) Use a checker to emit elm-format issues. Thanks to [@gollerob](https://github.com/gollerob)


## 0.9.4 (20170-07-26)

* [PR #94](https://github.com/stil4m/elm-analyse/pull/94) Use proper names for log/crash. Thanks to [@eeue56](https://github.com/eeue56)

## 0.9.3 (20170-06-23)

* [Issue #88](https://github.com/stil4m/elm-analyse/issues/88) Bump node-watch library to fix duplicate file triggers.

## 0.9.2 (2017-06-20)

* [Issue #83](https://github.com/stil4m/elm-analyse/issues/83) Only watch file changes that are actual Elm files

## 0.9.1 (2017-06-19)

Fix for wrongly build Elm source.

## 0.9.0 (2017-06-19)

* [Issue #73](https://github.com/stil4m/elm-analyse/issues/73) Update messages on file changes
* [Issue #74](https://github.com/stil4m/elm-analyse/issues/74) Make ranges tech agnostic
* [Issue #75](https://github.com/stil4m/elm-analyse/issues/75) Replace ESLint with [Prettier](https://github.com/prettier/prettier)
* [Issue #76](https://github.com/stil4m/elm-analyse/issues/76) (Check) Detect duplicate imported variables
* [Issue #78](https://github.com/stil4m/elm-analyse/issues/78) Improve speed by caching in home dir.
* [Issue #79](https://github.com/stil4m/elm-analyse/issues/79) Speed up Travis CI build.
* [Issue #81](https://github.com/stil4m/elm-analyse/issues/81) Imported Types and Type aliases are not marked as unused.


## 0.8.0 (2017-06-14)

* [Issue #68](https://github.com/stil4m/elm-analyse/issues/68) Extract [elm-syntax](https://github.com/stil4m/elm-syntax)
* [Issue #70](https://github.com/stil4m/elm-analyse/issues/70) Order message by filename
* [Issue #72](https://github.com/stil4m/elm-analyse/issues/72) Check if elm-stuff exists and halt start


## 0.7.0 (2017-04-14)

* [Issue #64](https://github.com/stil4m/elm-analyse/issues/64) Detect cyclic package dependencies
* [Issue #65](https://github.com/stil4m/elm-analyse/issues/65) Depend on elm-format node module

## 0.6.0 (2017-03-29)

* [Issue #58](https://github.com/stil4m/elm-analyse/issues/58) Unnecessary params and negative numbers
* [Issue #59](https://github.com/stil4m/elm-analyse/issues/59) Parsing error with empty list + multiline comment
* [Issue #60](https://github.com/stil4m/elm-analyse/issues/60) Add cache buster to UI sources
* [Issue #61](https://github.com/stil4m/elm-analyse/issues/61) Functions defined in let bindings
* [Issue #63](https://github.com/stil4m/elm-analyse/issues/63) Unused imported operator

## 0.5.1 (2017-03-18)

* [Issue #57](https://github.com/stil4m/elm-analyse/issues/57) Can't install elm-analyse on Linux

## 0.5.0 (2017-03-17)

* [Issue #43](https://github.com/stil4m/elm-analyse/issues/43) Add ESLint to verify style of code in PRs
* [Issue #45](https://github.com/stil4m/elm-analyse/issues/45) Add UnnecessaryPortModule check
* [Issue #46](https://github.com/stil4m/elm-analyse/issues/46) Use of Regex.regex as a non static function (runtime error abound)
* [Issue #51](https://github.com/stil4m/elm-analyse/issues/51) Use of Core's Array package
* [Issue #54](https://github.com/stil4m/elm-analyse/issues/54) Print `http://localhost:{port}` when running with -s. Thanks to [@zwilias](https://github.com/zwilias)
* [Issue #56](https://github.com/stil4m/elm-analyse/issues/56) Ignore elm source files in directories with starting with lower case.
* [PR #47](https://github.com/stil4m/elm-analyse/pull/47) Add list of top importers and importees. Thanks to [@felixLam](https://github.com/felixLam)
* [PR #48](https://github.com/stil4m/elm-analyse/pull/48) Improve module graph UI. Thanks to [@felixLam](https://github.com/felixLam)

## 0.4.0 (2017-03-10)

* [Issue #33](https://github.com/stil4m/elm-analyse/issues/33) Better messages when parsing to AST fails
* [Issue #34](https://github.com/stil4m/elm-analyse/issues/34) Allow configuration for excluded paths
* [Issue #35](https://github.com/stil4m/elm-analyse/issues/35) Better distinction in logging between loading dependencies and files
* [Issue #38](https://github.com/stil4m/elm-analyse/issues/38) Cached sources interfere with code completion in elmjutsu
* [PR #39](https://github.com/stil4m/elm-analyse/pull/39) Add module graph analysing. Thanks to [@felixLam](https://github.com/felixLam)
* [PR #42](https://github.com/stil4m/elm-analyse/pull/42) Add interactive module graph using sigma.js. Thanks to [@felixLam](https://github.com/felixLam)
* [PR #43](https://github.com/stil4m/elm-analyse/pull/43) Visualisation with Sigma.js with filtering. Thanks to [@felixLam](https://github.com/felixLam)

## 0.3.1 (2017-03-06)

* [Issue #36](https://github.com/stil4m/elm-analyse/issues/36) Exit with error code when encountering issues. Thanks to [@felixLam](https://github.com/felixLam)

## 0.3.0 (2017-03-05)

* [Issue #18](https://github.com/stil4m/elm-analyse/issues/18) Add documentation to function in post processing
* [Issue #26](https://github.com/stil4m/elm-analyse/issues/26) Decoding of cached AST is too forgiving
* [Issue #27](https://github.com/stil4m/elm-analyse/issues/27) Add max length configuration for LineLengthExceeded
* [Issue #28](https://github.com/stil4m/elm-analyse/issues/28) Multiline unnecessary parens is not highlighted correctly
* [Issue #29](https://github.com/stil4m/elm-analyse/issues/29) Remove TypeArg type from AST
* [Issue #30](https://github.com/stil4m/elm-analyse/issues/30) Add documentation to type aliases
* [Issue #31](https://github.com/stil4m/elm-analyse/issues/31) Autofixer for unused type alias
* [Issue #32](https://github.com/stil4m/elm-analyse/issues/32) Unnecessary parens in list are not detected

## 0.2.0 (2017-03-02)

* [Issue #24](https://github.com/stil4m/elm-analyse/issues/24) Record type aliases should be formatted multiline when exceeding N fields
* [Issue #25](https://github.com/stil4m/elm-analyse/issues/25) Add version command for CLI

## 0.1.5 (2017-02-26)

* [Issue #16](https://github.com/stil4m/elm-analyse/issues/16) Bug: Auto-fixes on last line of file fail
* [PR #21](https://github.com/stil4m/elm-analyse/pull/21) Fixes for typos in README. Thanks to [@zwilias](https://github.com/zwilias).
* [Issue #22](https://github.com/stil4m/elm-analyse/issues/22) Ignore `node_module` directory in file-gatherer
* [Issue #23](https://github.com/stil4m/elm-analyse/issues/23) Add auto fixer for UnusedImport

## 0.1.4 (2017-02-25)

* [Issue #19](https://github.com/stil4m/elm-analyse/issues/19) "Unused imported variable": Destructured Single Type Union in let-statement

## 0.1.3 (2017-02-25)

* Add JS sources to package, instead of post install step

## 0.1.2 (2017-02-25)

* Update README

## 0.1.0 (2017-02-25)

Initial version
