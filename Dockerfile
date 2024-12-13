from node:22-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --verbose
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/ ./
EXPOSE 3000
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV GENERATE_SOURCEMAP=false
CMD ["npm", "run", "start"]
