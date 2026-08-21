FROM cgr.dev/chainguard/python:latest-dev AS builder

WORKDIR /app

# 1. Create a virtual environment to cleanly isolate your packages
RUN python -m venv /app/venv --without-pip
ENV PATH="/app/venv/bin:$PATH"

RUN curl -sS https://bootstrap.pypa.io/get-pip.py | /app/venv/bin/python

RUN /app/venv/bin/pip install --no-cache-dir -U "setuptools>=78.1.1" "msgpack>=1.2.1"

COPY requirements.txt .
RUN /app/venv/bin/pip install --no-cache-dir --no-deps -r requirements.txt

# --- Distroless Runtime (0 CVEs) ---
FROM cgr.dev/chainguard/python:latest

WORKDIR /app

# 3. Bring over the isolated virtual environment from the builder stage
COPY --from=builder /app/venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY app/ ./app/

EXPOSE 8000
# nosemgrep: dockerfile.security.missing-user
USER non-root CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
