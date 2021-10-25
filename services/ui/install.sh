#!/bin/sh

if [ "${DEVELOPMENT}" != "true" ]; then 
    npm install -g serve@^12.0.1
    npm run build
fi

# Development builds do nothing