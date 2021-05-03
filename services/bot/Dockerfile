FROM node:15.14.0-alpine3.13

# Set the working directory
WORKDIR /app

# Copy in dependency file
COPY package.json package.json

# Install dependency
RUN yarn

# Copy in the source
COPY src src
COPY types types
COPY tsconfig.json tsconfig.json
COPY .eslintrc .eslintrc
COPY jest.config.js jest.config.js

RUN yarn build && rm -rf src types

# Set entrypoint to start express server
ENTRYPOINT ["npm", "run"]
CMD ["start"]