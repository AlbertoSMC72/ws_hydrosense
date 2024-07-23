import { Server } from 'socket.io';
import http from 'http';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

// Crear una instancia del logger pino con pino-pretty
const logger = pino(pinoPretty({
    colorize: true
}));

// Crear un servidor HTTP
const server = http.createServer();

// Crear una instancia de Socket.IO sobre el servidor HTTP
const io = new Server(server, {
    // Configuraciones adicionales si son necesarias
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Manejar nuevas conexiones de clientes
io.on('connection', (socket) => {
    logger.info('Cliente conectado');

    // Enviar un mensaje al cliente conectado
    socket.emit('message', { message: 'Bienvenido al servidor en tiempo real' });

    // Manejar mensajes recibidos del cliente
    socket.on('message', (message) => {
        logger.info(`Recibido: ${message}`);

        // Reenviar el mensaje a todos los clientes conectados
        io.emit('message', message);
    });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        logger.info('Cliente desconectado');
    });

    // Manejar errores
    socket.on('error', (err) => {
        logger.error('Socket.IO error:', err);
    });
});

// Escuchar en el puerto 8080
const PORT = 8080;
server.listen(PORT, () => {
    logger.info(`Servidor WebSocket en tiempo real escuchando en el puerto ${PORT}`);
});
