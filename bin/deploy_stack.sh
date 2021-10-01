#!/bin/bash

if [[ -z $1 ]]; then
    echo "Version number not provided";
    exit 1;
else
    echo "Version number found: $1"
fi

today=$(date +"%b %d, %Y")

# Deploy the docs to docs.qutexbot.com
mkdocs gh-deploy

export QUTEX_RELEASE_DATE="$today"
export QUTEX_VERSION=$1
export QUTEX_IMAGE=docker.pkg.github.com/amthorn/qutex/qutex_bot:${QUTEX_VERSION}

echo "
Release Date: ${QUTEX_RELEASE_DATE}
Version: ${QUTEX_VERSION}
Image: ${QUTEX_IMAGE}
"

read -p "Press enter to continue"

docker --context qutex stack deploy --with-registry-auth qutex -c docker-compose.yml