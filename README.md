# FlashDelivery - Monolito CRUD

Aplicacion monolito para gestion de la plataforma de delivery FlashDelivery.

## Requisitos

- Docker Desktop instalado y corriendo

## Como ejecutar (recomendado)

Abre una terminal dentro de esta carpeta y ejecuta:

```bash
docker compose up --build -d
```

Espera unos segundos y luego carga los datos de prueba:

```bash
docker compose exec app node seed.js
```

Abre el navegador en:

http://localhost:3000

## Comandos utiles

```bash
# Levantar todo
docker compose up --build -d

# Cargar datos de prueba
docker compose exec app node seed.js

# Ver logs
docker compose logs -f

# Detener todo
docker compose down
```

## Datos de prueba incluidos

- 2 restaurantes
- 2 repartidores
- 2 clientes
- 2 pedidos

## Estructura

```
flashdelivery/
  models/
  routes/
  public/
  seed.js
  server.js
  Dockerfile
  docker-compose.yml
  package.json
```
