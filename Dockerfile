## Build environment. Resulting build in /app/build
FROM node:lts-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# Avoid JS heap out of memory when building
ARG NODE_OPTIONS=--max-old-space-size=3000

# Backend location defaults to what is in .env file when the image was built.

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent

# Copy application files and build
COPY . ./
RUN npm run build

## Prod environment.
FROM nginx:stable-alpine as prod
LABEL org.opencontainers.image.source="https://github.com/weso/rdfshape-client"
WORKDIR /usr/share/nginx/html

# Add bash
RUN apk add --no-cache bash
# Copy custom nginx config (react routing, compression...)
COPY nginx/*.conf /etc/nginx/conf.d/

# Copy react app build and files needed to set environment
COPY --from=build /app/build .
# Script to make ENV vars available to the app
COPY env.sh .
COPY .env .
RUN chmod +x env.sh

# Run
EXPOSE 80
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
