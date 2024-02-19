# Stage 1: Use a Node.js 18 Alpine base image
FROM node:18-alpine AS node_base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Stage 2: Use a Python 3.10.12 image to install npm packages
FROM python:3.10.12-alpine AS python_install

# Set the working directory
WORKDIR /app

# Copy only the necessary files to install npm packages
COPY --from=node_base /app/package*.json ./

# Install Python dependencies
RUN apk --no-cache add \
    build-base \
    python3-dev \
    libffi-dev \
    openssl-dev \
    && apk del build-base python3-dev libffi-dev openssl-dev

# Stage 3: Use the Node.js 18 Alpine image as the final image
FROM node:18-alpine AS final

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the previous stage
COPY --from=python_install /app/package*.json ./

# Continue with your application setup and commands
RUN npm install

COPY . .

EXPOSE 3001

# Example: Start your Node.js application
CMD ["npm", "start"]
