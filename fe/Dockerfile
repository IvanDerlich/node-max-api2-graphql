# fe/Dockerfile

FROM node:16.20.2-alpine
WORKDIR /app

# Copy the frontend code and install dependencies
COPY . .
RUN npm install

# Expose the port the frontend app runs on
EXPOSE 3000

# Start the frontend application
CMD ["npm", "run", "start"]