# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Set environment variable (will be overridden by .env in production)
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
