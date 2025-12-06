# Use a stable LTS image
FROM node:18-bullseye

# Create app directory
WORKDIR /app

# Create non-root user
RUN useradd --user-group --create-home --shell /bin/bash appuser

# Copy package files first for caching
COPY package*.json ./

# If package-lock exists, npm ci will be used to get deterministic dependencies
RUN npm ci --production

# Copy application source
COPY . .

# Give ownership to non-root user
RUN chown -R appuser:appuser /app

USER appuser

ENV NODE_ENV=production
# Expose no ports explicitly because this is a CLI app.
# If in future you expose a web server, set EXPOSE <port>

# Run the CLI app. Keep container attached (non-daemon) so logs show in docker logs.
CMD ["node", "main.js"]
