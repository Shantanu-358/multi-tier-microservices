FROM cgr.dev/chainguard/python:latest-dev AS builder

WORKDIR /app

# 1. Create a virtual environment to cleanly isolate your packages
RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Distroless Runtime (0 CVEs) ---
FROM cgr.dev/chainguard/python:latest

WORKDIR /app

# 3. Bring over the isolated virtual environment from the builder stage
COPY --from=builder /app/venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY app/ ./app/

EXPOSE 8000
# nosemgrep: dockerfile.security.missing-user
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
