#!/bin/bash

# Wait for PostgreSQL to be ready
until pg_isready -h $POSTGRES_HOST -U $POSTGRES_USER; do
  echo "Waiting for database..."
  sleep 1
done

# Run migrations
echo "Running migrations..."
npx sequelize-cli db:migrate
