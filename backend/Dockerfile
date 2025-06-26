# Step 1: create a node.js base image
FROM node:22-alpine

# Step 2: set the working directory
WORKDIR /app

# Step 3: copy the package.json and package-lock.json files
COPY package*.json ./

# Step 4: install dependencies
RUN npm install

# Step 5: copy the source code
COPY . .

# Step 7: expose the port
EXPOSE 5000

# Step 8: start the application
CMD ["npm", "run", "dev"]
