#!/bin/bash

CURRENT_DIR=$(pwd)

for FILE in ./src/*.js; do
    f="$(basename -- $FILE)"
    minify "$FILE" > "$CURRENT_DIR/dist/${f%.*}".min.js
done