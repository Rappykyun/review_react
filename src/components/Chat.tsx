import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ChatMessage = {
  id?: string;
  type?: "chat" | "system";
  user?: string;
  text: string;
  ts?: number;
  self?: boolean;
};

const WS_URL = (import.meta.env.VITE_WS_URL as string) || "ws://localhost:3001";

export default function Chat() {
  const [username, setUsername] = useState(
    "User" + Math.floor(Math.random() * 1000)
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.addEventListener("open", () => setConnected(true));
    ws.addEventListener("close", () => setConnected(false));
    ws.addEventListener("error", () => setConnected(false));
    ws.addEventListener("message", (ev) => {
      try {
        const data: ChatMessage = JSON.parse(ev.data);
        setMessages((prev) => [...prev, data]);
      } catch {
        setMessages((prev) => [...prev, { text: String(ev.data) }]);
      }
    });

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
      return;
    wsRef.current.send(JSON.stringify({ user: username, text }));
    setInput("");
  };

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <Card className="max-w-2xl mx-auto p-4 border border-gray-300 rounded-xl shadow-lg bg-white">
      <CardHeader className="flex flex-row items-center justify-between mb-4">
        <CardTitle className="text-2xl font-semibold">WebSocket Chat</CardTitle>
        <Badge
          className={
            connected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {connected ? "Connected" : "Disconnected"}
        </Badge>
      </CardHeader>

      <CardContent>
        <label className="block mb-3">
          <span className="text-sm text-gray-600">Username</span>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <div className="border border-gray-200 rounded-lg p-4 mb-4 max-h-[300px] overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-24">
              No messages yet
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`mb-2 flex ${
                  m.self ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${
                    m.type === "system"
                      ? "bg-blue-100"
                      : m.self
                      ? "bg-green-100"
                      : "bg-white"
                  } border border-gray-300`}
                >
                  {m.type !== "system" && (
                    <div className="text-xs text-gray-500 mb-1">
                      {m.self ? "You" : m.user || "Anonymous"}
                    </div>
                  )}
                  <div>{m.text}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={onSubmit} className="flex gap-3">
          <Textarea
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Button
            type="submit"
            disabled={!connected || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
