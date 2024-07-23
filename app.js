import WebSocket, { WebSocketServer } from 'ws';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

// Crear una instancia del logger pino con pino-pretty
const logger = pino(pinoPretty({
    colorize: true
}));

// Crear una instancia del servidor WebSocket en el puerto 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    logger.info('Cliente conectado');

    // Enviar un mensaje al cliente conectado
    ws.send(JSON.stringify({ message: 'Bienvenido al servidor en tiempo real' }));

    // Manejar mensajes recibidos del cliente
    ws.on('message', function incoming(message) {
        //logger.info(`Recibido: ${message}`);

        // Procesar el mensaje recibido y reenviarlo a todos los clientes conectados
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Manejar la desconexión del cliente
    ws.on('close', function close() {
        logger.info('Cliente desconectado');
    });

    // Manejar errores
    ws.on('error', function error(err) {
        //logger.error('WebSocket error:', err);
    });
});

logger.info('Servidor WebSocket en tiempo real escuchando en el puerto 8080');
