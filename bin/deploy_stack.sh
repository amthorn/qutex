#!/bin/bash

if [[ -z $1 ]]; then
    echo "Version number not provided";
    exit 1;
else
    echo "Version number found: $1"
fi

echo "=> Deploying Documentation"

# Deploy the docs to docs.qutexbot.com
mkdocs gh-deploy

echo "=> Done"

./create_version.sh "$1"

echo "=> Depoying"

env QUTEX_VERSION="${QUTEX_VERSION}" docker --context qutex stack deploy --with-registry-auth qutex -c docker-compose.yml

echo "=> Done"