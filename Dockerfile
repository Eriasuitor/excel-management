FROM nginx:alpine
WORKDIR /app
COPY ./build /usr/share/nginx/html
EXPOSE 80