#!/bin/sh
cd bruhchart
yarn
yarn parcel build index.html

cd dist
ENC=$(base64 index.html)

echo "export default \`" > index.ts
echo "$ENC" >> index.ts
echo "\`;" >> index.ts
rm -r ./.parcel-cache

echo "Build chart lib"
