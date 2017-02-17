# Elm Analyse

## Prerequisites

The following binaries should be available on the path:

```
node >=6
elm  0.18.x
elm-format (a version that is compatible with the source code you wish to analyse)
```

## Setup

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

## Usage

Change directory to the target elm project to analyser and run `elm-analyser`.

Add the `-s` option for the server mode. This can be viewed in the browser. To change the port use `-p XXXX`

## Supported Checks

| Check         | Description   | Auto-fixable  |
| ------------- | ------------- | ------------- |
| DuplicateImports | This check will look for imports that are defined twice. The Elm compiler will not fail on this, but it is better to merge these two imports into one. | TODO |
| NoDebugStatements|  This check will look if a `Debug.log` or `Debug.crash` is used within the code. This is nice for development, but you do not want to ship this code to package users or your endusers. | TODO |
| NoImportAll | This check will look for imports that expose all functions from a module `(..)`. When other people read your code, it would be nice if the origin of a used function can be traced back to the providing module. |  |
| NoSignature | This check will look for function declarations without a signature. We want our readers to understand our code. Adding a signature is a part of this. This check will **skip** definitions in let statements. |  |
| NoExposeAll | This check will look for modules that expose all their definitions. This is not a best practice. You want to be clear about the API that a module defined. | |
| NoUnurriedPrefix | It is unneeded to use an operator in prefix notation when you apply both arguments directly. This check will look for these kind of usages | TODO |
| OverriddenVariables | You should not redefine a variable in a new lexical scope. This is confusing and may lead to bugs. | |
| UnnecessaryParens | If you want parenthesis, then you might want to look into Lisp. It is good to know when you do not need them in Elm and this check will let you know. This check follows this [discussion](https://github.com/avh4/elm-format/issues/262) from `elm-format`. | :white_check_mark: |
| UnusedImportAliases | Sometimes you defined an alias for an import (`import Foo as F`), but it turns out you never use it. This check shows where you have unused import aliases. | :white_check_mark: |
| UnusedImports | Imports that have no meaning should be removed. | TODO |
| UnusedTypeAlias | When you defined an type alias, but you do not use it in any signature or expose it, then it is just filling up space. It is better to remove it. | TODO |
| UnusedVariable | There are a lot of cases of variables that are unused. Functions that are imported, unused defined functions, unused variables of defined functions, unused variables in patterns. These are all noise and might imply some refactoring. | :white_check_mark: :heavy_exclamation_mark: |
| UseConsOverConcat | If you concatenate two lists, but the right hand side is a single element list, then you should use the cons operator. | TODO |
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
