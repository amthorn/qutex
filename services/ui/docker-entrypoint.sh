#!/bin/sh

if [ "${DEVELOPMENT}" = "true" ]; then 
    npm start
else
    serve -s build -l 3000 -n
fi