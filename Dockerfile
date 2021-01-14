FROM quay.io/cdis/node:12.10.0-alpine

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL info

# Copy all local files into the image.
COPY . .

# Build for production.
RUN npm install \
    && npm run build

# Set the command to start the node server.
# CMD [ "./auspice.js", "view", "--datasetDir", "data" ]

# Tell Docker about the port we'll run on.
EXPOSE 4000
