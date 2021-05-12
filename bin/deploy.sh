#!/bin/bash

if [[ -z $1 ]]; then
    echo "Version number not provided";
    exit 1;
else
    echo "Version number found: $1"
fi

today=$(date +"%b %d, %Y")

ansible-playbook bin/deploy.yml --extra-vars "QUTEX_RELEASE_DATE=\"$today\" QUTEX_VERSION=$1 SRC=\"qutex\"" -v
