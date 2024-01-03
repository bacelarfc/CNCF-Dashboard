# Server Dockerfile

# Use Node.js as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the server's package.json and package-lock.json
COPY server/package*.json ./

# Install the server's dependencies
RUN npm install

# Copy the server's source code
COPY server/ .

# Copy the built client app
COPY client/dist /usr/src/app/public

# Expose the port the app runs on
EXPOSE 8081

# Start the server
CMD ["node", "server.js"]
