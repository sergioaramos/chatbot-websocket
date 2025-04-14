# Chat Bot con WebSockets

Una aplicación de chat en tiempo real construida con Node.js, Express, Socket.IO y Turso/libSQL.

## Descripción

Esta aplicación permite a los usuarios chatear en tiempo real a través de WebSockets. Los mensajes son almacenados en una base de datos Turso (SQLite distribuido), lo que permite la persistencia de datos y la recuperación de mensajes al reconectarse.

## Características

- Comunicación en tiempo real con WebSockets
- Persistencia de mensajes en base de datos
- Nombres de usuario aleatorios generados automáticamente
- Recuperación de estado de conexión para mantener el historial de mensajes

## Tecnologías utilizadas

- **Backend:**
  - Node.js
  - Express
  - Socket.IO
  - Turso/libSQL (base de datos)
  - dotenv (variables de entorno)
  - Morgan (logging)

- **Frontend:**
  - HTML/CSS
  - JavaScript
  - Socket.IO Client

## Requisitos previos

- Node.js (versión recomendada: 18.x o superior)
- Una cuenta en [Turso](https://turso.tech/) para la base de datos

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/sergioaramos/chatbot-websocket.git
   cd chatbot-websocket
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Añade las siguientes variables:
     ```
     PORT=3000
     DB_URL=<tu-url-de-turso>
     DB_TOKEN=<tu-token-de-turso>
     ```

## Uso

1. Inicia la aplicación:
   ```
   npm run dev
   ```

2. Abre tu navegador y ve a `http://localhost:3000`

3. ¡Comienza a chatear! La aplicación asignará automáticamente un nombre de usuario aleatorio.

## Estructura del proyecto

```
chatbot-websocket/
├── client/
│   └── index.html      # Interfaz de usuario y lógica del cliente
├── server/
│   └── index.js        # Servidor Express y lógica de Socket.IO
├── .env                # Variables de entorno (no incluido en el repositorio)
├── .gitignore
├── package.json
└── README.md
```

## Cómo funciona

1. **Conexión de WebSocket:**
   - Cuando un usuario se conecta, se establece una conexión Socket.IO
   - Se carga el nombre de usuario desde localStorage o se genera uno nuevo

2. **Historial de mensajes:**
   - Al conectarse, el servidor envía los mensajes recientes desde la base de datos
   - Los nuevos mensajes se almacenan en la base de datos y se transmiten a todos los usuarios

3. **Recuperación de estado:**
   - Si un usuario se desconecta y vuelve a conectar, Socket.IO recupera su estado
   - Se cargan solo los nuevos mensajes desde el último offset conocido

## Licencia

ISC

## Autor

Sergio Alejandro Ramos Grajales

---

Desarrollado como parte de un proyecto de aprendizaje de Node.js y WebSockets.