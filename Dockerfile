FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Mount a persistent volume at /app/data and set DATABASE_PATH=/app/data/motorhead.db
CMD ["node", "--disable-warning=ExperimentalWarning", "server.js"]
