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
