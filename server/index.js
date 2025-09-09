
import http from 'http';
import { WebSocketServer } from 'ws';

const PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 3001;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running.\n');
});

const wss = new WebSocketServer({ server });


function broadcast(data, except) {
  for (const client of wss.clients) {
    if (client.readyState === 1 && client !== except) {
      client.send(data);
    }
  }
}

wss.on('connection', (ws) => {

  ws.send(JSON.stringify({ type: 'system', text: 'Welcome to the chat!' }));

  ws.on('message', (raw) => {
    let payload;
    try {
      payload = JSON.parse(raw.toString());
    } catch (e) {

      payload = { text: raw.toString() };
    }

    const msg = {
      type: 'chat',
      id: Math.random().toString(36).slice(2),
      user: payload.user || 'Anonymous',
      text: payload.text || '',
      ts: Date.now(),
    };


    ws.send(JSON.stringify({ ...msg, self: true }));
    broadcast(JSON.stringify(msg), ws);
  });

  ws.on('close', () => {

  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});

