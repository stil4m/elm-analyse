FROM node:8-alpine

WORKDIR /app

RUN apk add python make gcc g++

USER node
