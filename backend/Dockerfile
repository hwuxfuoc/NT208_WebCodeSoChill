FROM node:20-bullseye-slim

# Install Python & GCC for Judge Engine
RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
