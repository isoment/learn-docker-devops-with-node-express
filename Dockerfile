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
# RUN npm install

# We need to pass in NODE_ENV so we have access to it in the bash script below
ARG NODE_ENV

# We can embed bash scripts in the Dockerfile, here we want to run a simple script
# with an if else statement to determine if we are in development mode or not.
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

# Copy all files from the current directory to /app
# Even when we set up a volume for development we still need this for deplyment.
COPY . ./

# Here we can declare enviroment variables
ENV PORT 3000

# The EXPOSE command lets others know that this application is expecting the specified port
# to be exposed.
EXPOSE $PORT

# At runtime run 'node index.js' for development we will override this in docker-compose to run 
# our npm dev script utilizing nodemon.
CMD [ "node", "index.js" ]