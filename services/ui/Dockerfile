FROM node:16.10.0-alpine3.13
LABEL maintainer="Ava Thorn" email="avatheavian@gmail.com"
ARG DEVELOPMENT
ENV DEVELOPMENT=${DEVELOPMENT}

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

###########################
# BUILD (NON-DEVELOPMENT) #
###########################

COPY install.sh /install.sh
RUN /install.sh

#########
# CLEAN #
#########

RUN rm -rf src public jsconfig.json
# Build folder will be left with static files

##############
# ENTRYPOINT #
##############

COPY docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
# HEALTHCHECK --interval=30s --start-period=5s --timeout=10s --retries=3 CMD ps aux | grep start.js