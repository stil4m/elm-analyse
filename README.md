# Elm Analyse

A tool that allows you analyse your [Elm](http://elm-lang.org/) code and identifies deficiencies and best practices.

<img src="https://ci.appveyor.com/api/projects/status/github/stil4m/elm-analyse?retina=true" height="24">
<img src="https://travis-ci.org/stil4m/elm-analyse.svg?branch=master" height="24">
<img src="https://badge.fury.io/js/elm-analyse.svg" height="24">

## Preview

<img src="https://github.com/stil4m/elm-analyse/raw/master/images/dashboard.png">
<img src="https://github.com/stil4m/elm-analyse/raw/master/images/single-message.png">
<img src="https://github.com/stil4m/elm-analyse/raw/master/images/terminal-output.png">



---
## Usage

### Prerequisites

The following binaries should be available on the path:

```
node >=6
elm  0.18.x
elm-format (a version that is compatible with the source code you wish to analyse)
```

### Install

```
npm install -g elm-analyse
```

or if using `yarn`:

```
yarn add elm-analyse
```

### Run

Change directory to the target elm project to analyser and run `elm-analyse`.

Add the `-s` option for the server mode. This can be viewed in the browser. To change the port use `-p XXXX`

### CLI Options

| Option | Description |
| ------ | ----------- |
| `--help or -h`          | Print the help output. |
| `--serve or -s`         | Enable server mode. Disabled by default. |
| `--port or -p`          | The port on which the server should listen. Defaults to 3000 (`--port=3000`). |
| `--elm-format-path`  | Path to elm-format. Defaults to `elm-format`. |

---

## Supported Checks

| Check         | Description   |
| ------------- | ------------- |
| DebugCrash | This check will look if a `Debug.crash` is used within the code. You may not want to ship this to your end users. |
| DebugLog | This check will look if a `Debug.log` is used within the code. This is nice for development, but you do not want to ship this code to package users or your endusers. |
| DropConcatOfLists | If you concatenate two lists (`[...] ++ [...]`), then you can merge them into one list. |
| DropConsOfItemAndList | If you cons an item to a literal list (`x :x [1, 2, 3]`), then you can just put the item into the list. |
| DuplicateImport | This check will look for imports that are defined twice. The Elm compiler will not fail on this, but it is better to merge these two imports into one. |
| ExposeAll | This check will look for modules that expose all their definitions. This is not a best practice. You want to be clear about the API that a module defined. |
| ImportAll | This check will look for imports that expose all functions from a module `(..)`. When other people read your code, it would be nice if the origin of a used function can be traced back to the providing module. |
| LineLengthExceeded | This check will mark files that contain lines that exceed over 150 characters (#18 allows configuring this variable). |
| NoTopLevelSignature | This check will look for function declarations without a signature. We want our readers to understand our code. Adding a signature is a part of this. This check will **skip** definitions in let statements. |
| NoUncurriedPrefix | It is unneeded to use an operator in prefix notation when you apply both arguments directly. This check will look for these kind of usages |
| RedefineVariable | You should not redefine a variable in a new lexical scope. This is confusing and may lead to bugs. |
| UnnecessaryListConcat | Yu should not use `List.concat` to concatenate literal lists. Just join the lists together. |
| UnnecessaryParens | If you want parenthesis, then you might want to look into Lisp. It is good to know when you do not need them in Elm and this check will let you know. This check follows this [discussion](https://github.com/avh4/elm-format/issues/262) from `elm-format`. |
| UnusedImport | Imports that have no meaning should be removed. |
| UnusedImportAlias | Sometimes you defined an alias for an import (`import Foo as F`), but it turns out you never use it. This check shows where you have unused import aliases. |
| UnusedImportedVariable | When a function is imported from a module but unused, it is better to remove it. |
| UnusedPatternVariable | Variables in pattern matching that are unused should be replaced with `_` to avoid unnecessary noice. |
| UnusedTopLevel | Functions that are unused in a module and not exported are dead code. These should be removed. |
| UnusedTypeAlias | When you defined an type alias, but you do not use it in any signature or expose it, then it is just filling up space. It is better to remove it. |
| UnusedVariable | Variables that are not used could be removed or marked as `_` to avoid unnecessary noise. |
| UseConsOverConcat | If you concatenate two lists, but the right hand side is a single element list, then you should use the cons operator. |

---

## Analysis Configuration

At this moment you can configure the checks that are included in the analysis by disabling or enabling them in a configuration file.

By default all checks are enabled. To disable checks, add an `elm-analyse.json` file to the root of the Elm project (besides the `elm-package.json`).

An example configuration to disable the `UnusedTypeAlias` check is presented below.

```
{
  "checks" : {
    "UnusedTypeAlias": false
  }
}
```

> Note: In the future different checks will be configurable. Please make suggestions for these configurations via issues.

The keys in the `checks` configuration match the keys in the [Supported Checks](#supported-checks) section.


## Scheduled Checks

See [#10](https://github.com/stil4m/elm-analyse/issues/10).

* Exceeded line length
* Unnecessary `List.concat` when concatenating only fixed size lists.
* Record type aliases should be formatted multiline when exceeding `N` fields.
* Functions where 'too much' happens.
* Function should be moved to another module for better encapsulation.
* Undocumented function that is exposed by module.
* Use alias for complex 'thing'. This can be done by inspecting signatures.
* Use point free notation where possible (`\_ -> b` to `always b` and `\x -> List.map f x` to `List.map f`)
* Determine untested code.
* Use multiline string instead of concatenated single line string.
* Use list concatenation instead of multiple `++`.
* Replace function with a function provided by `elm-lang/*` or `elm-community/*`.
* Magic numbers.

---

## Library Setup

The library is divided into the following main modules:

* `Analyser`: The `main` file that bootstraps the analysis and maintains the core state
* `AST.*`: The AST for Elm 0.18 and related functions to serialise and deserialise.
* `ASTUtil.*`: Utility functions for fact extraction on the AST.
* `Parser.*`: Parsing Elm files using [parser-combinators](https://github.com/elm-community/parser-combinators).
* `Analyser.Checks.*`: All the checks that are performed
* `Analyser.Fixes.*`: All the fixes that can be performed,
* `Analyser.Messages.*`: All messages that can be produced and the supporting functions
* `Client.*`: Front-end code for running in 'server' mode.
