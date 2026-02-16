import { useEffect, useRef, useCallback } from "react";

export function useWebSocket(boardId) {
  const wsRef = useRef(null);
  const listenersRef = useRef(new Set());

  useEffect(() => {

    if (!boardId) return;


    const isDev = window.location.hostname === "localhost";
    const wsUrl = isDev ? `ws://localhost:5001?boardId=${boardId}`
      : `wss://${window.location.host}?boardId=${boardId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () => console.log("WebSocket connected!");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      listenersRef.current.forEach((fn) => fn(data));

    };
    ws.onclose = () => console.log("Websocket disconnected");
    return () => {

      ws.close();
      wsRef.current = null;

    };
  }, [boardId]);
  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);
  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn);
    return () => listenersRef.current.delete(fn);
  }, []);
  return { send, subscribe };


}
