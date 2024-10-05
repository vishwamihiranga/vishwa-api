# Use Node.js LTS version (Debian-based)
FROM node:lts-buster

# Set environment variables
ENV NODE_ENV=production

# Update the package repository and install dependencies
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json first to leverage Docker caching
COPY package.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy all other files to the working directory
COPY . .

# Expose the port on which the app will run
EXPOSE 3000

# Start the app directly using Node.js
CMD ["node", "server.js"]
