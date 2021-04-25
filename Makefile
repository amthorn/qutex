.PHONY: build
build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build


.PHONY: up
up:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
	yarn --cwd services/node start:dev-bot
	
.PHONY: logs
logs:
	docker logs -f qutex_node_1

.PHONY: up-prod
up-prod:
	docker compose up -d

.PHONY: down
down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

.PHONY: test
test:
	${MAKE} build
	docker compose -f docker-compose.yml -f docker-compose.dev.yml run node test