FROM node:alpine as build

WORKDIR /app/frontend

COPY . .

RUN npm ci
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]