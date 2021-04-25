.PHONY: up
up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
	yarn --cwd services/node start:dev-bot
	docker logs -f qutex_node_1

.PHONY: up-prod
up-prod:
	docker compose up -d

.PHONY: down
down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down