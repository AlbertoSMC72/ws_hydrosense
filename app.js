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
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Manejar nuevas conexiones de clientes
io.on('connection', (socket) => {
    logger.info('Cliente conectado');

    // Enviar un mensaje al cliente conectado

    // Manejar mensajes recibidos del cliente
    socket.on('message', (message) => {
        // Reenviar el mensaje a todos los clientes conectados
        io.emit('message', message);
        logger.info('Enviado a todos los clientes:', message);
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
