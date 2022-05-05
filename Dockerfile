# The base image
FROM node:17

# Sets the working directory for the container, when files are copied to the
# container they end up here.
WORKDIR /app

# Copy the package.json file to the above directory, we want this to be in a seperate
# copy command since the package.json doesn't change to much, when it does all the
# commands afterwards are run again.
COPY package.json .

# Run executes at build time
RUN npm install

# Copy all files from the current directory to /app
# Even when we set up a volume for development we still need this for deplyment.
COPY . ./

# Here we can declare enviroment variables
ENV PORT 3000

# The EXPOSE command lets others know that this application is expecting the specified port
# to be exposed.
EXPOSE $PORT

# At runtime run our npm dev script utilizing nodemon
CMD [ "npm", "run", "dev" ]