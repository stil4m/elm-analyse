# [Elm Analyse](http://stil4m.github.io/elm-analyse)

A tool that allows you to analyse your [Elm](http://elm-lang.org/) code, identify deficiencies and apply best practices.

<img src="https://ci.appveyor.com/api/projects/status/github/stil4m/elm-analyse?branch=master&retina=true" height="24">
<img src="https://travis-ci.org/stil4m/elm-analyse.svg?branch=master" height="24">
<img src="https://badge.fury.io/js/elm-analyse.svg" height="24">

## Preview

<img src="https://github.com/stil4m/elm-analyse/raw/master/images/dashboard.png">
<img src="https://github.com/stil4m/elm-analyse/raw/master/images/single-message.png">
<img src="https://github.com/stil4m/elm-analyse/raw/master/images/terminal-output.png">
<img src="https://github.com/stil4m/elm-analyse/raw/master/images/package-dependencies.png">

---
## Usage

### Prerequisites

The following binaries should be available on the path:

```
node >=8
elm  0.19.x
elm-format (a version that is compatible with the source code you wish to analyse)
```

### Install

```
npm install -g elm-analyse
```

or if using `yarn`:

```
yarn global add elm-analyse
```

### Run

Change to the directory of Elm project you want to analyse and run `elm-analyse`.

Add the `-s` option for server mode. This will allow you to view results in your browser. To change the port use `-p XXXX`

### CLI Options

| Option | Description |
| ------ | ----------- |
| `--help or -h`          | Print the help output. |
| `--serve or -s`         | Enable server mode. Disabled by default. |
| `--port or -p`          | The port on which the server should listen. Defaults to 3000 (`--port=3000`). |
| `--open or -o`          | Open default browser when server goes live. |
| `--elm-format-path`     | Path to elm-format. Defaults to `elm-format`. |
| `--version` or `-v`     | Print version of software. |
| `--format`              | Output format for CLI. Defaults to "human". Valid values are either "human" or "json". |

---

## Supported Checks

All supported checks can be found in the [check documentation](https://stil4m.github.io/elm-analyse/#/messages).

---

## Analysis Configuration

Checks can be enable or configured based on your preferences. For this see the [Configuration Docs](https://stil4m.github.io/elm-analyse/#/configuration).

---

## Issues

If you have feature ideas or checks that you wish to see, please create an issue.
Please check that you do not create duplicate issues or a check for which we [already have a report](https://github.com/stil4m/elm-analyse/issues/10).

## Contributing

Please see [the docs](https://stil4m.github.io/elm-analyse/#/contributing)
---

## Library Setup

The library is divided into the following main modules:

* `Analyser`: The `main` file that bootstraps the analysis and maintains the core state.
* `ASTUtil.*`: Utility functions for fact extraction on the AST.
* `Analyser.Checks.*`: All the checks that are performed.
* `Analyser.Fixes.*`: All the fixes that can be performed.
* `Analyser.Messages.*`: All messages that can be produced and the supporting functions.
* `Client.*`: Front-end code for running in 'server' mode.

The code that represents the Elm syntax and the parsing is supported by the [elm-syntax](https://github.com/stil4m/elm-syntax) package.
