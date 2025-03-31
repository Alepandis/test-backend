FROM python:3.13.2

RUN apt update && apt install -y nodejs npm

WORKDIR /test-backend

COPY . /test-backend

WORKDIR /test-backend/frontend
RUN npm install

# PUERTOS 8000 backend 5173 react

EXPOSE 8000 5173

# comandos para ejecutar los servicios

CMD bash -c "uvicorn test-backend/main:app --host 0.0.0.0 --port 8000 & cd test-backend/frontend && npm run dev -- --host"
