#!/bin/sh

if [ "${DEVELOPMENT}" = "true" ]; then 
    npm install -g npm-run-all@^4.1.5 react-scripts@^4.0.3 node-sass@^6.0.1
else
    npm install -g serve@^12.0.1
    npm run build
fi
