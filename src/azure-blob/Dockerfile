# syntax=docker/dockerfile:1
FROM node:20-slim
WORKDIR /app
COPY package*.json ./

# This temporarily "mounts" the secrets from GitHub during the install
RUN --mount=type=secret,id=AZURE_STORAGE_ACCOUNT_NAME,env=AZURE_STORAGE_ACCOUNT_NAME \
    --mount=type=secret,id=AZURE_STORAGE_ACCOUNT_KEY,env=AZURE_STORAGE_ACCOUNT_KEY \
    --mount=type=secret,id=AZURE_CONTAINER_NAME,env=AZURE_CONTAINER_NAME \
    npm install --production

COPY . .
EXPOSE 3000
CMD ["node", "index.js"]