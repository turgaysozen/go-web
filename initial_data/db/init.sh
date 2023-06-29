#!/bin/bash
set -e

# Create user and database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "$POSTGRES_DB_NAME";
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB_NAME" TO "$POSTGRES_USER";
EOSQL
