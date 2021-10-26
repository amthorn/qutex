FROM python:3.9-alpine
LABEL MAINTAINER="Ava Thorn" EMAIL="avatheavian@gmail.com"
ARG SERVICE_PREFIX

# Install pip requirements
COPY services/_api_service_template/requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN rm -f requirements.txt

WORKDIR /qutex

COPY services/_api_service_template/src .

# Copy service-specific files
COPY services/${SERVICE_PREFIX}/api ./api
COPY services/${SERVICE_PREFIX}/documents ./documents
COPY services/${SERVICE_PREFIX}/*.py ./

ENV SERVICE_PREFIX=${SERVICE_PREFIX}
ENTRYPOINT ["flask", "run", "--host=0.0.0.0", "--port=4000"]
HEALTHCHECK --interval=30s --start-period=5s --timeout=30s --retries=3 CMD wget http://localhost:4000/api/v1/${SERVICE_PREFIX}/healthcheck -q -O - | grep OK