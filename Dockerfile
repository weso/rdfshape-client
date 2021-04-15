## Build environment.

# Build application inside /app
# Resulting build in /app/build
FROM node:14.16.1-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# Avoid JS heap out of memory when building
ARG NODE_OPTIONS=--max-old-space-size=3000

# Backend location. Override with: --build-arg RDFSHAPE_HOST=[LOCATION]
ARG RDFSHAPE_HOST=https://rdfshape.weso.es:8080
ENV REACT_APP_RDFSHAPE_HOST ${RDFSHAPE_HOST}

# Copy dependency list
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci --silent

# Copy all application files and trigger react build
COPY . ./
RUN npm run build

## Prod environment.
FROM nginx:stable-alpine as prod
COPY --from=build /app/build /usr/share/nginx/html
# Custom nginx config for react routing
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Pending:
# - Custom API address. Default one should be our published one on rdfshape.weso.es:8080?
