FROM python:3.11-slim

WORKDIR /workspace

# Install system dependencies needed for compiling python packages if any
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package requirements
COPY requirements.txt .

# Install requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend codebase
COPY . .

# Expose FastAPI default port
EXPOSE 8000

# Set environment path to locate app package
ENV PYTHONPATH=.

# Start FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
