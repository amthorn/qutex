#!/bin/bash

if [[ -z $1 ]]; then
    echo "Version number not provided";
    exit 1;
else
    echo "Version number found: $1"
fi

today=$(date +"%b %d, %Y")

# Deploy the docs to docs.qutexbot.com
# mkdocs gh-deploy

QUTEX_RELEASE_DATE="$today"
QUTEX_VERSION=$1

echo "
Release Date: ${QUTEX_RELEASE_DATE}
Version: ${QUTEX_VERSION}
"

read -p "Press enter to continue"

echo "QUTEX_RELEASE_DATE=${QUTEX_RELEASE_DATE}
QUTEX_VERSION=${QUTEX_VERSION}
" > .version.env

make down up
# env QUTEX_VERSION=${QUTEX_VERSION} docker --context qutex stack deploy --with-registry-auth qutex -c docker-compose.yml