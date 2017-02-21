#!/bin/sh

./node_modules/.bin/gulp elm-performance-single-file && node performance/single-file.js src/Inspection.elm
