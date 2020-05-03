# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./
#COPY ./env.sh ./public/
#COPY .env .
MOVE ./env.sh ./public/
MOVE ./env-config.js ./public/
RUN apk add --no-cache bash

# Make our shell script executable
#RUN chmod +x public/env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "ls -l && ls -l public/ && chmod +x /app/public/env.sh && /app/public/env.sh && npm start"]
# start app
#CMD ["npm", "start"]

##THIS IS NOT WORKING BECAUSE OF THE ENV SCRIPT
