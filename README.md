# 🧴 Perfulandia - E-commerce de Perfumes

Bienvenido al repositorio de **Perfulandia**, una aplicación web Full Stack diseñada para la gestión y venta de perfumes exclusivos. Este proyecto integra un frontend moderno en React con un backend robusto en Spring Boot.

## 🚀 Tecnologías

* **Frontend:** React.js, Bootstrap, CSS Modules.
* **Backend:** Java Spring Boot, Spring Security (JWT).
* **Base de Datos:** H2 Database (Archivo local).

---

## 🛠️ Guía de Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu máquina local. Necesitarás tener instalados **Java JDK 17+** y **Node.js**.

### 1. Configurar y Ejecutar el Backend (Servidor)

El backend maneja la lógica de negocio y la base de datos.

1.  Abre una terminal y navega a la carpeta del backend:
    ```bash
    cd backend
    ```

2.  Ejecuta el proyecto usando Maven Wrapper (no necesitas tener Maven instalado):
    * **En Windows:**
        ```bash
        ./mvnw.cmd spring-boot:run
        ```
    * **En Mac/Linux:**
        ```bash
        ./mvnw spring-boot:run
        ```

3.  El servidor iniciará en el puerto **8080**.
    * *Nota: La base de datos H2 se creará automáticamente en la carpeta `backend/data`.*

### 2. Configurar y Ejecutar el Frontend (Cliente)

El frontend es la interfaz visual que verán los usuarios.

1.  Abre **otra terminal nueva** (mantén la del backend abierta) y ve a la carpeta del frontend:
    ```bash
    cd react-perfumelandia
    ```

Instalación manual de librerías

Si necesitas agregar las dependencias manualmente una por una:

Navegación y UI
```bash
npm install react-router-dom react-bootstrap bootstrap
```
Animaciones
```bash
npm install framer-motion
```

▶️ Ejecutar el Proyecto

Para iniciar el servidor de desarrollo local:
```bash
npm start
```
4.  El navegador se abrirá automáticamente en: `http://localhost:3000`

---

## 🔑 Credenciales de Acceso

Para probar las funcionalidades de administrador (como el Panel de Control y eliminar productos):

* **Usuario Admin:** `admin@perfulandia.com`
* **Contraseña:** *(La que hayas definido en tu base de datos o regístrate con un nuevo usuario y cambia su rol a 'ADMIN' en la DB)*.

---

## 🔐 acceso base de datos h2

Al ejecutar el backend quedara habilitado el acceso oline a la consola de h2SQL
```bash
http://localhost:8080/h2-console
```
si es primera vez en ejecutarla configurar de la siguiente manera 
Driver Class:
```bash
org.h2.Driver
```

JDBC URL:

```bash
jdbc:h2:file:./data/perfulandia_db
```
User Name:
```bash
sa(default)
```

dar conectar y estaras dentro 


## 📂 Estructura del Proyecto

* `/backend` - Código fuente de la API Java Spring Boot.
* `/react-perfumelandia` - Código fuente de la interfaz React.

---

**Desarrollado por:** Roberto Palma 
