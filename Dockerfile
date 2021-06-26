FROM nginx:1.17.8-alpine
WORKDIR /var/mirror-messaging
COPY ./www/ .
COPY ./nginx.conf /etc/nginx/nginx.conf