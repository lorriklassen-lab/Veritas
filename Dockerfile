FROM node:20-slim AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM python:3.12-slim
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code AND built frontend side by side
COPY backend/ .
COPY --from=frontend-build /app/dist ./frontend/dist

EXPOSE 8000

CMD ["python", "main.py"]