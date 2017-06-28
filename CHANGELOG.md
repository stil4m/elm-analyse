# elm-analyse changelog

## 0.9.2 (2017-06-20)

* [Issue #83](https://github.com/stil4m/elm-analyse/issues/83) Only watch file changes that are actual Elm files

## 0.9.1 (2017-06-19)

Fix for wrongly build Elm source.

## 0.9.0 (2017-06-19)

* [Issue #73](https://github.com/stil4m/elm-analyse/issues/73) Update messages on file changes
* [Issue #74](https://github.com/stil4m/elm-analyse/issues/74) Make ranges tech agnostic
* [Issue #75](https://github.com/stil4m/elm-analyse/issues/75) Replace ESLint with
* [Issue #76](https://github.com/stil4m/elm-analyse/issues/76) (Check) Detect duplicate imported variables
* [Issue #78](https://github.com/stil4m/elm-analyse/issues/78) Improve speed by caching in home dir.
* [Issue #79](https://github.com/stil4m/elm-analyse/issues/79) Speed up Travis CI build. [Prettier](https://github.com/prettier/prettier)
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
