"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 3000 });
const Rooms = {};
wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    ws.on("message", function message(data) {
        const event = JSON.parse(data);
        const { host, type, id, sdp, candidate } = JSON.parse(data);
        switch (type) {
            case "Join":
                if (!Rooms.id && host === "Sender") {
                    Rooms.id = { websockets: [] };
                    Rooms.id.websockets.push(ws);
                    ws.send(JSON.stringify({ type: "Sender Joined" }));
                }
                else if (Rooms.id && host === "Receiver") {
                    if (Rooms.id.websockets.length >= 2) {
                        ws.send(JSON.stringify({ type: "User Exceed" }));
                        return;
                    }
                    Rooms.id.websockets.push(ws);
                    ws.send(JSON.stringify({ type: "Receiver Joined" }));
                }
                else {
                    ws.send(JSON.stringify({ type: "First Create Room" }));
                    return;
                }
                ws.roomId = id;
                if (Rooms.id && Rooms.id.websockets.length == 2) {
                    Rooms.id.websockets.forEach((client) => {
                        client.send(JSON.stringify({ type: "Ready" }));
                    });
                }
                break;
            case "Offer":
                if (Rooms.id && Rooms.id.websockets) {
                    Rooms.id.websockets.forEach((client) => {
                        if (ws !== client && client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: "Offer", sdp: sdp }));
                        }
                    });
                }
                break;
            case "Answer":
                if (Rooms.id && Rooms.id.websockets) {
                    Rooms.id.websockets.forEach((client) => {
                        if (ws !== client && client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: "Answer", sdp: sdp }));
                        }
                    });
                }
                break;
            case "Ice_candidate":
                if (Rooms.id && Rooms.id.websockets) {
                    Rooms.id.websockets.forEach((client) => {
                        if (ws !== client && client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: "Ice_candidate", candidate: candidate }));
                        }
                    });
                }
                break;
        }
    });
    ws.on("close", () => {
        const ID = ws.roomId;
        if (ID && Rooms.id.websockets) {
            Rooms.id.websockets = Rooms.id.websockets.filter((x) => x !== ws);
            Rooms.id.websockets.forEach((client) => {
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "peer-disconnected" }));
                }
            });
            if (Rooms.id.websockets.length == 0) {
                delete Rooms.id;
            }
        }
    });
});
