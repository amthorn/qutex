.PHONY: build
build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build


.PHONY: up
up:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
	yarn --cwd services/node start:dev-bot
	
.PHONY: logs
logs:
	docker-compose logs -f node

.PHONY: up-prod
up-prod:
	docker compose up -d

.PHONY: down
down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down
	docker volume rm qutex_mongo_volume

.PHONY: test
test:
	yarn --cwd services/node test --silent

.PHONY: lint
lint:
	yarn --cwd services/node lint
	