#!/bin/bash

SDIR=$(pwd)
cd $(git rev-parse --show-toplevel)

yarn ios --configuration Release         
PROCESS="$(ps aux | grep CoreSimulator | grep nativeapp | tr -s " ")"
echo $PROCESS
IOS_BIN="$(echo $PROCESS | cut -d " " -f11)"
PID="$(echo $PROCESS | cut -d " " -f2)"

echo Bin: $IOS_BIN
echo Simulator PID: $PID

cd dist
cp -R $(dirname $IOS_BIN) app-release.app

echo Done.

cd $SDIR
