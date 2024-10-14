# be/Dockerfile

FROM node:20.18.0-alpine
WORKDIR /app

# Copy the backend code and install dependencies
COPY . .
RUN npm install

# Expose the backend port
EXPOSE 5000

# Start the backend application
CMD ["npm", "run", "dev"]