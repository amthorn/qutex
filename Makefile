.PHONY: build $(SERVICE)
build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.build.yml build $(SERVICE)

.PHONY: up $(SERVICE)
up:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build $(SERVICE) -d

.PHONY: deploy $(VERSION)
deploy:
	./bin/deploy_stack.sh $(VERSION)

.PHONY: logs
logs:
	docker compose logs -f bot

.PHONY: down
down:
	docker compose down

.PHONY: test-qutex
test-qutex:
	export QUTEX_TESTING=true && \
	yarn --cwd services/bot test --verbose && \
	unset QUTEX_TESTING

.PHONY: test-nginx
test-nginx:
	pytest services/nginx/tests

.PHONY: test
test:
	${MAKE} test-qutex
	${MAKE} test-nginx

.PHONY: lint
lint:
	yarn --cwd services/bot lint
	yarn --cwd services/ui lint
	flake8 services
	