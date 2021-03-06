#!/bin/bash

echo "=> Creating version"

today=$(date +"%b %d, %Y")

QUTEX_RELEASE_DATE="$today"
QUTEX_VERSION=$1

echo "
Release Date: ${QUTEX_RELEASE_DATE}
Version: ${QUTEX_VERSION}
"
if [[ -z $2 ]]; then
    read -p "Press enter to continue"
fi;

cat > .version.env <<EOF
QUTEX_RELEASE_DATE='${QUTEX_RELEASE_DATE}'
QUTEX_VERSION=${QUTEX_VERSION}
EOF

cat .version.env

echo "=> Done"