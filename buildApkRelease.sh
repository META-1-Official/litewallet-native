#!/bin/bash

SDIR=$(pwd)
cd $(git rev-parse --show-toplevel)

cd android
./gradlew build -x lint
cd ..

cp ./android/app/build/outputs/apk/release/app-release.apk ./dist/

osx_copy(){ 
  LINK="$(greadlink -f -- "$1")"
  osascript \
    -e "on run args" \
    -e "set the clipboard to POSIX file (first item of args)" \
    -e end \
    "$LINK"
}

if [[ "$OSTYPE" == "darwin"* ]]; then

  if [[ -n "$(which greadlink | grep -i "not found")" ]]; then
    echo "Install findutils"
    echo "brew install findutils"
    exit 0
  fi
  echo "Copying file to clipboard"
  sleep 2
  osx_copy "./dist/app-release.apk"
  echo "APK File copied to clipboard"
  cp ./dist/app-release.apk ~/Documents/
else
  echo "TODO: Add clipboard support for $OSTYPE"
fi

cd $SDIR
