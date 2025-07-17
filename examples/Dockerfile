# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=24.3.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Accept environment variables as build arguments
# ARG VITE_SENDER_ADDRESS
# ARG VITE_SENDER_PRIVATE_KEY
# ARG VITE_TOKEN_CONTRACT_ADDRESS
# ARG VITE_NETWORK
# ARG VITE_RPC_URL
# ARG VITE_REOWN_PROJECT_ID

# Remove setting environment variables during build
# ENV VITE_SENDER_ADDRESS=$VITE_SENDER_ADDRESS
# ENV VITE_SENDER_PRIVATE_KEY=$VITE_SENDER_PRIVATE_KEY
# ENV VITE_TOKEN_CONTRACT_ADDRESS=$VITE_TOKEN_CONTRACT_ADDRESS
# ENV VITE_NETWORK=$VITE_NETWORK
# ENV VITE_RPC_URL=$VITE_RPC_URL
# ENV VITE_REOWN_PROJECT_ID=$VITE_REOWN_PROJECT_ID

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM nginx

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
