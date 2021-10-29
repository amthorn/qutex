#!/bin/bash

if [[ -z $1 ]]; then
    echo "Version number not provided";
    exit 1;
else
    echo "Version number found: $1"
fi

# Deploy the docs to docs.qutexbot.com
mkdocs gh-deploy

./create_version.sh "$1"

env QUTEX_VERSION="${QUTEX_VERSION}" docker --context qutex stack deploy --with-registry-auth qutex -c docker-compose.yml