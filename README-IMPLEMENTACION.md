# Perfulandia — ejecución local integrada

## Qué incluye esta corrección
- Login con JWT firmado HMAC, expiración y validación; contraseñas nuevas con BCrypt.
- El registro siempre crea rol `USER`; no se asigna rol administrador por el correo.
- Endpoints de administración RabbitMQ restringidos a `ROLE_ADMIN`.
- Topología declarativa con 3 colas de trabajo, 3 DLQ, exchange Direct, exchange Topic y DLX.
- Reintentos del consumidor (3 intentos) y rechazo sin reencolado para que RabbitMQ derive el mensaje a su DLQ.
- Gateway Kong en `http://localhost:8000`, Keycloak/OIDC en `http://localhost:8081` y clúster RabbitMQ en `localhost:15672`.

## Inicio
1. Instala Docker Desktop y Docker Compose v2.
2. Copia `.env.example` a `.env` y cambia las contraseñas/secretos. `JWT_SECRET` debe tener al menos 32 bytes; usa un secreto aleatorio único.
3. Ejecuta `docker compose up --build -d`.
4. Revisa `docker compose ps` y `docker compose logs -f backend`.
5. Frontend: en `react-perfumelandia`, configura `REACT_APP_API_URL=http://localhost:8000` en `.env` y ejecuta `npm install && npm start`.
6. RabbitMQ Management: `http://localhost:15672`. Keycloak: `http://localhost:8081`, realm `perfulandia`. Kong Admin API: `http://localhost:8001` (solo entorno local).

## Endpoints relevantes
- `POST /auth/register` JSON `{ "email":"usuario@ejemplo.cl", "password":"ClaveSegura123", "nombre":"Usuario" }`
- `POST /auth/login` JSON `{ "email":"usuario@ejemplo.cl", "password":"ClaveSegura123" }`
- `GET /api/admin/rabbitmq/status` (requiere JWT con rol ADMIN)
- `POST /api/admin/rabbitmq/queues`, `/exchanges`, `/exchanges/topic`, `/bindings`
- `DELETE /api/admin/rabbitmq/queues/{nombre}`, `/exchanges/{nombre}`, `/bindings`

## Importante sobre autenticación externa
Keycloak se levanta con un realm OIDC importado, pero el flujo de login actual del frontend continúa usando el endpoint local `/auth/login` y JWT propio. No se debe afirmar que la app ya autentica contra Keycloak hasta integrar el flujo Authorization Code + PKCE en React y configurar Spring como OAuth2 Resource Server con el issuer del realm. Kong está configurado como API gateway/proxy con CORS; no se activa validación JWT en Kong porque el JWT local y el de Keycloak tienen emisores/firmas distintos.

## Límites y comprobación
No se ha desplegado en una nube pública ni se han creado cuentas reales en un proveedor cloud. El compose es un entorno reproducible local. El segundo nodo RabbitMQ intenta unirse al primero al arrancar; verifica el estado real con `docker compose exec rabbit1 rabbitmqctl cluster_status`. El listener de órdenes valida y registra el mensaje; la lógica transaccional real de negocio debe completarse antes de producción.

## Seguridad
No publiques `.env`, no uses secretos de ejemplo fuera de local, rota cualquier secreto anteriormente expuesto, deshabilita la consola H2 en producción y usa una base de datos gestionada. El almacenamiento de JWT en `localStorage` es vulnerable ante XSS; para producción, considera cookies HttpOnly/Secure/SameSite o un flujo OIDC con PKCE.

## Crear un usuario administrador para la demo
Por seguridad, el endpoint público de registro no permite autoconceder privilegios. Registra primero una cuenta normal y luego cambia su columna `ROLE` a `ADMIN` desde una consola SQL de desarrollo o una migración controlada. No habilites H2 Console en una instancia expuesta a Internet.
