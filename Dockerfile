# Set the desire Node version
ARG NODE_VERSION=16

# Use Node image with Alpine as lot more lightweight than Debian
ARG BASE_IMAGE=alpine


FROM node:${NODE_VERSION}-${BASE_IMAGE}

RUN mkdir -p /api
WORKDIR /api
