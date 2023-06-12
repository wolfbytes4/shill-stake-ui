# build environment

FROM node:lts-alpine3.13 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile --silent

RUN npm install vite@4.1.0 -g --silent

COPY . ./
RUN npm run build

# production environment

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
