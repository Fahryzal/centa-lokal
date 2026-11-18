# Stage 1: Build
FROM node:20-slim as builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 7198
CMD ["yarn", "start:prod"]
