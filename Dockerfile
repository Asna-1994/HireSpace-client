
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy all other source files
COPY . .

# Build the app
RUN npm run build

# The correct port for Vite dev server
EXPOSE 5173

# Use development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]