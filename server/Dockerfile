#Use an official Node.js 18 image as a starting point
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
COPY package*.json ./
# Install production dependencies
RUN npm install
# ---- Application Stage ----
# Copy the rest of our application code
COPY . .
# Expose the port that our app will run on
EXPOSE 5001
# The command to run when the container starts
CMD [ "npm", "start" ]