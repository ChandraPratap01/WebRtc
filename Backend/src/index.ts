
import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 3000 });
interface room {
  websockets: WebSocket[] ;
}
interface CustomWebSocket extends WebSocket {
  roomId?: string;
}

const Rooms: { [id: string]: room } = {};
wss.on("connection", function connection(ws: CustomWebSocket) {
  ws.on("error", console.error);
  
  ws.on("message", function message(data: any) {
     const event= JSON.parse(data);
    const { host,type, id, sdp,candidate} = JSON.parse(data);
   console.log(event);
    switch (type) {
      case "Join":
        console.log(!Rooms.id);
        console.log(host==="Sender");
        if (!Rooms.id && host==="Sender") {
          Rooms.id = { websockets: [] };
           Rooms.id.websockets.push(ws);
           ws.send(JSON.stringify({type:"Sender Joined"}));
            console.log("Sender Joined Room");
        }
        else if(Rooms.id && host==="Receiver"){
           if ( Rooms.id.websockets.length >= 2) {
          ws.send(JSON.stringify({type:"User Exceed"}));
          console.log("Room Full")
          return;
        }
          Rooms.id.websockets.push(ws);
           ws.send(JSON.stringify({type:"Receiver Joined"}));
        }else{
          ws.send(JSON.stringify({type:"First Create Room"}));
          return;
        }
        ws.roomId = id;
        console.log("New client connected with ID:",ws.roomId);
        console.log(Rooms.id);
        console.log(Rooms.id.websockets.length == 2);

        if (Rooms.id && Rooms.id.websockets.length == 2) {
          Rooms.id.websockets.forEach((client) => {
            console.log("Ready to both send");
            client.send(JSON.stringify({ type: "Ready" }));
          });
        }
        break;
      case "Offer":
        console.log(Rooms.id);
        console.log( Rooms.id.websockets);
        if (Rooms.id && Rooms.id.websockets) {
          console.log("inside Offer Block")
          Rooms.id.websockets.forEach((client) => {
             console.log("more inside Offer Block")
            console.log(client.readyState);
            console.log(ws !== client)
            if (ws !== client && client.readyState === WebSocket.OPEN) {
              console.log(ws !== client)
              client.send(JSON.stringify({ type: "Offer", sdp:sdp }));
            }
          });
        }
        break;
      case "Answer":
        if (Rooms.id && Rooms.id.websockets) {
          Rooms.id.websockets.forEach((client) => {
            if (ws !== client && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "Answer", sdp:sdp }));
            }
          });
        }
        break;
        case "Ice_candidate":
            if(Rooms.id && Rooms.id.websockets){
              console.log("inside Ice candidate");
               Rooms.id.websockets.forEach((client)=>{
                console.log(client.readyState===WebSocket.OPEN);
                console.log(ws!==client);
                    if(ws!==client && client.readyState===WebSocket.OPEN){
                      console.log("Incecandidaatea Send")
                        client.send(JSON.stringify({type:"Ice_candidate",candidate:candidate}))
                        
                    }
                })
            }
            break;
    }
  });
  ws.on("close", () => {
    const ID = ws.roomId;
    if (ID && Rooms.id.websockets) {
      Rooms.id.websockets = Rooms.id.websockets.filter((x) => x !== ws);
      Rooms.id.websockets.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "peer-disconnected" }));
        }
      });
      if (Rooms.id.websockets.length == 0) {
        delete Rooms.id;
        console.log("Room Deleted");
      }
    }
    console.log("Client Disconnected");
  });
});
