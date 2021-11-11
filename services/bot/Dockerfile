FROM node:17.1.0-alpine3.13 as build

# Set the working directory
WORKDIR /app

# Install curl for the healthckec
RUN apk update && apk add curl

# Copy in dependency file
COPY package.json package.json

# Install dependency
RUN yarn

# Copy in the source
COPY src src
COPY types types
COPY migrations migrations
COPY tsconfig.json tsconfig.json
COPY .eslintrc .eslintrc
COPY jest.config.js jest.config.js
COPY migrate-mongo-config.js migrate-mongo-config.js

RUN yarn build && rm -rf src types

# Set entrypoint to start express server
ENTRYPOINT ["npm", "run"]
CMD ["start"]
HEALTHCHECK --interval=1m30s --retries=3 --timeout=10s CMD curl -f http://localhost:3000/healthcheck