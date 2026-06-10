FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM python:3.12-slim
WORKDIR /app

# Copy built frontend into the backend directory (expected path by main.py)
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Expose the port
EXPOSE 8000

# Start the server
CMD ["python", "main.py"]
