#!/bin/bash
set -e
bold=$(tput bold)
normal=$(tput sgr0)

if [ -z ${NETWORK+x} ]; then
  source .env;
fi

echo "Network $NETWORK"

cd ios 

NOW="$NETWORK-$(date +"%m_%d_%YT%H-%M")"
echo 

if ! which xcbeautify > /dev/null; then
  PIPE=tee
else
  PIPE=xcbeautify
fi

xcodebuild -workspace nativeapp.xcworkspace -configuration Release -scheme nativeapp -archivePath ./dist/ archive | $PIPE && \
mkdir -p ../dist/ios-$NOW && \
xcodebuild -exportArchive -archivePath dist.xcarchive -exportOptionsPlist exportOptions.plist -exportPath ../dist/ios-$NOW | $PIPE

DIAWI_JOB=`curl -s https://upload.diawi.com/ -F token=$DIAWI_TOKEN \
-F file=@../dist/ios-$NOW/META1.ipa \
-F find_by_udid=1 \
-F wall_of_apps=1 | jq -r '.job'`

echo "${bold}Diawi Job Id:${normal} $DIAWI_JOB"

sleep 3

LINKR=`curl -s 'https://upload.diawi.com/status' -G -d "token=$DIAWI_TOKEN" -d "job=$DIAWI_JOB"`
LINK=$(echo $LINKR | jq -r '.link')

echo "${bold}Diawi App link:${normal} $LINK"
echo "${bold}Build for network:${normal} $NETWORK"

curl qrenco.de/${LINK} 
