# Use a lightweight Node.js image
FROM node:18-alpine

# Install build tools
RUN apk add --no-cache make gcc g++ python3

# Set working directory
WORKDIR /usr/local/content/app

# Copy project files into the container
ADD ./ /usr/local/content/app

# Install dependencies
RUN npm install --legacy-peer-deps \
    && npm install ioredis \
    && npm run build

# Install PM2 for process management
RUN npm install -g pm2

RUN npm rebuild bcrypt --build-from-source

# Create a non-root user and set permissions
RUN addgroup -S cmms-root && adduser -S cmms-root -G cmms-root \
    && chown -R cmms-root:cmms-root /usr/local/content/app

# Switch to the non-root user
USER cmms-root

# Expose application port (adjust if needed)
EXPOSE 3000

# Start the application using PM2
CMD ["pm2-runtime", "dist/main.js", "--name", "cmms-apis"]