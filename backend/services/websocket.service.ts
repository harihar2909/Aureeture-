import { WebSocketServer, WebSocket, RawData } from 'ws';
import http from 'http';

let wss: WebSocketServer;

export const initializeWebSocket = (server: http.Server) => {
    wss = new WebSocketServer({ server, path: '/api/caro/ws' });

    wss.on('connection', (ws: WebSocket) => {
        console.log('💡 WebSocket client connected');

        ws.on('message', (message: RawData) => {
            const text = typeof message === 'string' ? message : message.toString();
            console.log(`Received message: ${text}`);
            // TODO: Process message with CARO's LLM service
            // For now, echo back
            ws.send(`Echo: ${text}`);
        });

        ws.on('close', () => {
            console.log('🔌 WebSocket client disconnected');
        });

        ws.on('error', (error: Error) => {
            console.error('WebSocket error:', error);
        });
    });

    console.log('✅ WebSocket server initialized.');
};

export const broadcast = (data: any) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};



