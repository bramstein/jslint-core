#!/bin/sh
wget -O lib/fulljslint.js http://www.jslint.com/fulljslint.js
echo "exports.JSLINT = JSLINT;" >> lib/fulljslint.js
NAME=`cat lib/fulljslint.js | grep -o -e "edition = .*" | grep -o [0-9]*-[0-9]*-[0-9]*`

sed -i "s/\"version\": \".*\"/\"version\": \"$NAME\"/g" package.json
