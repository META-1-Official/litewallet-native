#!/bin/bash


if [ -z ${NETWORK+x} ]; then
  source .env;
fi

echo "Network $NETWORK"

cd ios 

NOW=$NETWORK_$(date +"%m_%d_%YT%H-%M")
if ! which xcbeautify > /dev/null; then
  PIPE=tee
else
  PIPE=xcbeautify
fi

xcodebuild -workspace nativeapp.xcworkspace -configuration Release -scheme nativeapp -archivePath ./dist/ archive | $PIPE && \
mkdir -p ../dist/ios-$NOW && \
xcodebuild -exportArchive -archivePath dist.xcarchive -exportOptionsPlist exportOptions.plist -exportPath ../dist/ios-$NOW | $PIPE
