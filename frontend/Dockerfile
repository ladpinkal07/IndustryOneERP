FROM node:18-alpine

WORKDIR /workspace

# Copy dependencies definitions
COPY package.json package-lock.json ./

# Install Node dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Start Next.js in development mode
CMD ["npm", "run", "dev"]
