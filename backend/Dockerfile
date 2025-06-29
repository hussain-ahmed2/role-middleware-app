# Step 1: create a node.js base image
FROM node:22-alpine

# Step 2: set the working directory
WORKDIR /app

# Step 3: install nodemon globally
RUN npm install -g nodemon

# Step 4: copy the package.json and package-lock.json files
COPY package*.json ./

# Step 5: install dependencies
RUN npm install

# Step 6: copy the source code
COPY . .

# Step 7: expose the port
EXPOSE 5000

# Step 8: start the application
CMD ["npm", "run", "dev"]
