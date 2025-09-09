# Simple WebSocket Chat (Demo)

This project includes a minimal WebSocket chat to demonstrate real‑time communication.

- Server: `server/index.js` (Node + `ws`) listens on `ws://localhost:3001`.
- Client: `src/components/Chat.tsx` connects to the server and renders a simple chat UI.

## Install server dependency

```
npm i 
```

## Run

- Terminal 1 (start the WebSocket server):

```
npm run serve
```

- Terminal 2 (start the Vite dev server):

```
npm run dev
```

Open the app (Vite default: http://localhost:5173), then open a second browser window to see real‑time messages sync across clients.

## How it works

- The browser creates a `WebSocket` to `ws://localhost:3001`.
- When a message is sent, the server broadcasts it to all connected clients.
- Messages are JSON objects with `user`, `text`, and metadata.

## What is WebSocket?

WebSocket is a web protocol that lets the browser and server keep a single, long‑lived, two‑way connection. Instead of the browser repeatedly asking “any updates?” (like with polling), both sides can push data to each other instantly over the same connection.

## Background (why it exists)

- Traditional HTTP is request/response: the client must initiate every exchange.
- Real‑time apps (chat, collaboration, dashboards) need server→client updates without waiting for a new request.
- WebSocket upgrades a normal HTTP request to a persistent, full‑duplex channel so both sides can send messages at any time.

## How WebSocket works (at a glance)

1. Handshake: The client makes an HTTP request with an “Upgrade: websocket” header. The server accepts and switches protocols.
2. Persistent connection: A TCP connection stays open; no re‑handshake per message.
3. Frames: Messages are sent as small frames (text or binary). Either side can send at any time.
4. Close: Either side can close; the other is notified so it can clean up and optionally reconnect.

## How it works in this project (your setup)

- Client (`Chat.tsx`)

  - Creates a connection: `new WebSocket(WS_URL)` where `WS_URL` defaults to `ws://localhost:3001`.
  - Listens for lifecycle events: `open` (mark Connected), `close`/`error` (mark Disconnected), and `message` (append to the chat list).
  - Sends messages with `ws.send(JSON.stringify({ user, text }))` when you submit the form.

- Server (`server/index.js`)

  - Hosts a `WebSocketServer` on the same HTTP server (port 3001 by default).
  - On connection: sends a system welcome message.
  - On message: parses JSON, builds a normalized chat message, echoes it back to the sender (marked `self: true`) and broadcasts to all other clients.

- Message shape
  - Inbound from client: `{ user: string, text: string }`.
  - Outbound from server: `{ id, type: 'chat' | 'system', user, text, ts, self? }`.


