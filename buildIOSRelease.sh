#!/bin/bash
cd ios 
if ! which xcbeautify > /dev/null; then
  xcodebuild -workspace nativeapp.xcworkspace -configuration Release -scheme nativeapp archive
else
  xcodebuild -workspace nativeapp.xcworkspace -configuration Release -scheme nativeapp archive | xcbeautify
fi
