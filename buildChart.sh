#!/bin/sh
cd bruhchart
yarn
yarn parcel build index.html

cd dist

echo "export default \`$(cat index.html)\`;" > index.js

rm -r ./.parcel-cache

echo "Build chart lib"
