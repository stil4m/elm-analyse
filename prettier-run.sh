#!/bin/sh
tsfiles=$(find ts -name "*.ts" | grep '\.ts$' | tr '\n' ' ')
[ -z "$tsfiles" ] && exit 0
diffs=$(node_modules/.bin/prettier --write --print-width 140 --single-quote --tab-width 4 $tsfiles)
[ -z "$diffs" ]
 exit 0
