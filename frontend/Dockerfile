FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_API_URL=""
RUN npm run build

FROM caddy:2-alpine

COPY --chown=caddy:caddy --from=build /app/dist /usr/share/caddy

USER caddy

EXPOSE 80

CMD ["caddy", "file-server", "--root", "/usr/share/caddy"]
