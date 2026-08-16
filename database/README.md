# Database Tier - PostgreSQL 16

This service provisions PostgreSQL 16 for persistent data storage.

## Local Credentials
- **Host**: `database` (internal Docker network) or `localhost:5432` (host access)
- **Database**: `app_db`
- **Username**: `postgres`
- **Password**: `postgres`

## Volume Persistence
Data is stored in the Docker named volume `postgres_data`.

## Useful Commands
- Connect via psql: `docker compose exec database psql -U postgres -d app_db`
- Inspect health status: `docker compose exec database pg_isready -U postgres`
