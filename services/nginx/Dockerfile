FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --start-period=5s --timeout=10s --retries=3 CMD service --status-all |& grep "\[ + \]  nginx$"