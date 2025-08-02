"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 3000 });
const Rooms = {};
console.log(Rooms);
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    console.log("New client connected with ID:");
    ws.on('message', function message(data) {
        const { type, id, sdp } = JSON.parse(data);
        switch (type) {
            case ("Join"):
                if (!Rooms[id]) {
                    Rooms[id] = { websockets: [] };
                }
                if (Rooms[id].websockets.length >= 2) {
                    ws.send(JSON.stringify({ type: "Rooms Already Full" }));
                    return;
                }
                Rooms[id].websockets.push(ws);
                console.log("Joinned ROOm");
                ws.roomId = id;
                if (Rooms[id].websockets.length == 2) {
                    Rooms[id].websockets.forEach(client => {
                        client.send(JSON.stringify({ type: "Ready" }));
                    });
                }
                break;
            case ("Offer"):
                if (Rooms[id].websockets) {
                    Rooms[id].websockets.forEach(client => {
                        if (ws !== client && client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: "Offer", sdp }));
                        }
                    });
                    break;
                }
            case ("Answer"):
                if (Rooms[id].websockets) {
                    Rooms[id].websockets.forEach(client => {
                        if (ws !== client && client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: "Answer", sdp }));
                        }
                    });
                }
                break;
        }
    });
    ws.on('close', () => {
        const ID = ws.roomId;
        if (ID && Rooms[ID].websockets) {
            Rooms[ID].websockets = Rooms[ID].websockets.filter(x => x !== ws);
            Rooms[ID].websockets.forEach((client) => {
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "peer-disconnected" }));
                }
            });
            if (Rooms[ID].websockets.length == 0) {
                delete (Rooms[ID]);
                console.log("Room Deleted");
            }
        }
        console.log("Client Disconnected");
    });
});
