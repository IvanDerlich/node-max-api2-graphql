# be/Dockerfile

FROM node:20.18.0-alpine

# Install required build tools
# RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /app

# Copy the backend code and install dependencies
COPY . .
RUN npm install

# Expose the backend port
EXPOSE 5000

# Start the backend application
CMD ["npm", "run", "dev"]