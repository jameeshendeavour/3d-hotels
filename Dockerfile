FROM node:20-alpine3.17 as build
WORKDIR /app
COPY package*.json /app/
RUN npm install -g ionic
RUN npm install
COPY ./ /app/
RUN ionic build
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/www/ /usr/share/nginx/html/

#Commands to build and run docker container
#docker build -t my-app:v1 .
#docker run -d --name myAppContainer -p 80:80 my-app:v1