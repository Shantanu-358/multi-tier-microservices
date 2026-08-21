FROM cgr.dev/chainguard/python:latest AS builder

WORKDIR /app

# Upgrade base setuptools first
RUN pip install --upgrade --no-cache-dir setuptools>=78.1.1 msgpack>=1.2.1

# Create virtual environment
RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Distroless Runtime ---
FROM cgr.dev/chainguard/python:latest

WORKDIR /app

COPY --from=builder /app/venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY app/ ./app/

EXPOSE 8000
USER non-root 
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]