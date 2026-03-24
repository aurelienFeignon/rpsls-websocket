import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { registerGameHandlers } from './game/registerGameHandlers.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('client connected:', socket.id);
    registerGameHandlers(io, socket);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});