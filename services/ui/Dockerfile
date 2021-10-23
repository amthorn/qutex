# FROM node:slim
FROM node:16.10.0-alpine3.13
LABEL maintainer="Ava Thorn" email="avatheavian@gmail.com"

###########################
# BASE CONTAINER COMMANDS #
###########################

WORKDIR /qutex

RUN npm update -g npm
COPY package.json package.json

################
# INSTALLATION #
################

RUN npm install

#####################
# APPLICATION FILES #
#####################

COPY src src
COPY public public
COPY jsconfig.json jsconfig.json

##############
# ENTRYPOINT #
##############

ENTRYPOINT ["npm"]
CMD ["start"]
# HEALTHCHECK --interval=30s --start-period=5s --timeout=10s --retries=3 CMD ps aux | grep start.js