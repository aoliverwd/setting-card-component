#!/bin/bash

CURRENT_DIR=$(pwd)

for FILE in ./src/*.js; do
    f="$(basename -- $FILE)"
    NEW_FILE="$CURRENT_DIR/dist/${f%.*}".min.js
    minify "$FILE" > "$NEW_FILE"

    old=".\/dist"
    new="https:\/\/cdn.jsdelivr.net\/gh\/aoliverwd\/setting-card-component@main\/dist"
    sed -i'' -e "s/$old/$new/g" $NEW_FILE
done