"use client";

import { useEffect, useRef, useState } from "react";

interface UseWebSocketOptions {
    url: string;
    onMessage?: (data: any) => void;
    onClose?: () => void;
    autoReconnect?:boolean
}

export function useWebSocket({ url, onMessage, autoReconnect = true, onClose }: UseWebSocketOptions) {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectRef = useRef<NodeJS.Timeout | null>(null);
    const shouldReconnect = useRef(true);
    const onMessageRef = useRef(onMessage);

    // Keep the ref updated with the latest callback
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        shouldReconnect.current = autoReconnect;

        function connect() {
            if (wsRef.current?.readyState === WebSocket.OPEN) return;

            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected");
                setConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const parsed = JSON.parse(event.data);
                    onMessageRef.current?.(parsed);
                } catch {
                    console.log("Message:", event.data);
                }
            };

            ws.onerror = () => {
                console.log("WebSocket error");
                onClose?.()
            };

            ws.onclose = (event) => {
                console.log("Disconnected:", event.code);
                setConnected(false);
                onClose?.()
                if (shouldReconnect.current) {
                    reconnectRef.current = setTimeout(connect, 3000);
                }
            };
        }

        connect();

        return () => {
            console.log("Cleanup WebSocket");
            shouldReconnect.current = false;

            if (reconnectRef.current) {
                clearTimeout(reconnectRef.current);
            }

            wsRef.current?.close(1000);
        };
    }, [url, autoReconnect, onClose]);

    const send = (data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    };

    return { send, connected };
}
