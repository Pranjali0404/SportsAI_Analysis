# ========================================
# Dockerfile for FastAPI Backend
# ========================================

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --create-home appuser

# Copy project files
COPY . .

# Create required directories
RUN mkdir -p /app/data

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch user
USER appuser

EXPOSE 8000

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
