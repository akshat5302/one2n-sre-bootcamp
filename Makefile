# Variables
DB_CONTAINER_NAME=student-db
DB_IMAGE=postgres:15.7-alpine
API_IMAGE_NAME=student-api
API_CONTAINER_NAME=student-api-container

test:
	npm run test

# Run linting
lint:
	npm run lint

lint-fix:
	npm run lint:fix

# Start DB container
start-db:
	docker run --name $(DB_CONTAINER_NAME) \
		-e POSTGRES_DB=student_db \
		-e POSTGRES_USER=akshat \
		-e POSTGRES_PASSWORD=12345 \
		-p 5432:5432 \
		-d postgres:15.7-alpine

# Build REST API docker image
build-api:
	docker build -t $(API_IMAGE_NAME) .

# Run DB migrations
run-migrations: build-api
	docker run --rm \
		-v $(PWD)/src:/app/src \
		-e POSTGRES_HOST=192.168.68.157 \
		-e POSTGRES_DB=student_db \
		-e POSTGRES_USER=akshat \
		-e POSTGRES_PASSWORD=12345 \
		$(API_IMAGE_NAME) \
		npx sequelize-cli db:migrate

# Run REST API docker container
run-api: run-migrations
	docker run --name $(API_CONTAINER_NAME) \
		-e POSTGRES_HOST=192.168.68.157 \
		-e POSTGRES_DB=student_db \
		-e POSTGRES_USER=akshat \
		-e POSTGRES_PASSWORD=12345 \
		-p 3000:3000 \
		-d $(API_IMAGE_NAME)

# Stop and remove containers
clean:
	docker stop $(DB_CONTAINER_NAME) $(API_CONTAINER_NAME) || true
	docker rm $(DB_CONTAINER_NAME) $(API_CONTAINER_NAME) || true

# All-in-one setup
setup: test lint-fix start-db build-api run-migrations run-api

.PHONY:test lint-fix start-db build-api run-migrations run-api clean setup
