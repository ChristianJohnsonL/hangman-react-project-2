# Use Node 22 Alpine (Vite 7 requires Node 20.19+ or 22.12+)
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# EXPLAINED: We expose 3000 to match the assignment requirements
EXPOSE 3000

# IMPORTANT: 
# --host 0.0.0.0 allows access from outside the container
# --port 3000 forces Vite to use your requested port instead of 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
