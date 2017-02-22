# Elm Analyse

A tool that allows you analyse your [Elm](http://elm-lang.org/) code and identifies deficiencies and best practices.

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

### Setup

Run the following scripts after the initial clone

```
npm install
npm link
```

To update run:

```
git pull
npm install
```

### Run

Change directory to the target elm project to analyser and run `elm-analyser`.

Add the `-s` option for the server mode. This can be viewed in the browser. To change the port use `-p XXXX`

### CLI Options

TODO

---

## Supported Checks

| Check         | Description   | Auto-fixable  |
| ------------- | ------------- | ------------- |
| DuplicateImports | This check will look for imports that are defined twice. The Elm compiler will not fail on this, but it is better to merge these two imports into one. | TODO [#5](https://github.com/stil4m/elm-analyse/issues/5) |
| NoDebugStatements|  This check will look if a `Debug.log` or `Debug.crash` is used within the code. This is nice for development, but you do not want to ship this code to package users or your endusers. | TODO [#5](https://github.com/stil4m/elm-analyse/issues/5) |
| NoImportAll | This check will look for imports that expose all functions from a module `(..)`. When other people read your code, it would be nice if the origin of a used function can be traced back to the providing module. |  |
| NoSignature | This check will look for function declarations without a signature. We want our readers to understand our code. Adding a signature is a part of this. This check will **skip** definitions in let statements. |  |
| NoExposeAll | This check will look for modules that expose all their definitions. This is not a best practice. You want to be clear about the API that a module defined. | |
| NoUncurriedPrefix | It is unneeded to use an operator in prefix notation when you apply both arguments directly. This check will look for these kind of usages | TODO [#5](https://github.com/stil4m/elm-analyse/issues/5) |
| OverriddenVariables | You should not redefine a variable in a new lexical scope. This is confusing and may lead to bugs. | |
| UnnecessaryParens | If you want parenthesis, then you might want to look into Lisp. It is good to know when you do not need them in Elm and this check will let you know. This check follows this [discussion](https://github.com/avh4/elm-format/issues/262) from `elm-format`. | :white_check_mark: |
| UnusedImportAliases | Sometimes you defined an alias for an import (`import Foo as F`), but it turns out you never use it. This check shows where you have unused import aliases. | :white_check_mark: |
| UnusedImports | Imports that have no meaning should be removed. | TODO [#5](https://github.com/stil4m/elm-analyse/issues/5) |
| UnusedTypeAlias | When you defined an type alias, but you do not use it in any signature or expose it, then it is just filling up space. It is better to remove it. | TODO [#5](https://github.com/stil4m/elm-analyse/issues/5) |
| UnusedVariable | There are a lot of cases of variables that are unused. Functions that are imported, unused defined functions, unused variables of defined functions, unused variables in patterns. These are all noise and might imply some refactoring. | :white_check_mark: :heavy_exclamation_mark: |
| UseConsOverConcat | If you concatenate two lists, but the right hand side is a single element list, then you should use the cons operator. | TODO [#5](https://github.com/stil4m/elm-analyse/issues/5) |
| DropConcatOfLists | If you concatenate two lists (`[...] ++ [...]`), then you can merge them into one list. | TODO [#5](https://github.com/stil4m/elm-analyse/issues/5) |
| DropConsOfItemAndList | If you cons an item to a literal list (`x :x [1, 2, 3]`), then you can just put the item into the list. | TODO [#5](https://github.com/stil4m/elm-analyse/issues/5) |
---

## Scheduled Checks

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
