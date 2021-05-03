.PHONY: build
build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build

.PHONY: build-prod
build-prod:
	docker compose build

.PHONY: up
up:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
	yarn --cwd services/bot start:dev-bot
	
.PHONY: logs
logs:
	docker-compose logs -f bot

.PHONY: up-prod
up-prod:
	docker-compose up -d

.PHONY: down
down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down
	docker volume rm qutex_mongo_volume

.PHONY: test
test:
	yarn --cwd services/bot test --silent

.PHONY: lint
lint:
	yarn --cwd services/bot lint
	