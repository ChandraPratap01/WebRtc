![WebRTC Flow]((https://github.com/ChandraPratap01/WebRtc/blob/main/asset/Screenshot%202025-08-19%20at%202.23.07%E2%80%AFPM.png))

# WebRTC P2P Communication

This project demonstrates a **peer-to-peer (P2P) video and data communication** system using **WebRTC**, with a **React + TypeScript frontend** and a **WebSocket-based signaling server**.  

---

## 🔹 Features
- **Real-time Communication**: Establishes direct P2P connections between browsers using WebRTC.  
- **Signaling with WebSocket**: Handles the exchange of SDP offers/answers and ICE candidates.  
- **STUN/TURN Integration**: Uses STUN for NAT traversal and TURN (optional) for relay in case direct connection fails.  
- **React + TypeScript Frontend**: Modern, type-safe UI built with React.  
- **Scalable Signaling Server**: Lightweight WebSocket server for signaling.  

---

## 🔹 How It Works
1. **Browser1** creates an offer via `RTCPeerConnection` and sends it through the WebSocket server.  
2. **Browser2** receives the offer, generates an answer, and sends it back through the signaling server.  
3. **STUN server** helps both browsers discover their **public IP addresses** behind NAT.  
4. If direct connection is blocked, a **TURN server** can relay the media.  
5. Once negotiation is complete, media/data flows directly between browsers (low latency).  

### Flow (as per diagram)
- **STUN** → Session Traversal Utilities for NAT (finds public IP).  
- **TURN** → Traversal Using Relays around NAT (fallback relay).  
- **NAT** → Network Address Translator handling local ↔ public IP mapping.  
- **WebSocket Server** → Transfers offers/answers and ICE candidates.  

---

## 🔹 Tech Stack
- **Frontend**: React, TypeScript  
- **Signaling Server**: Node.js + WebSocket  
- **WebRTC APIs**: RTCPeerConnection, getUserMedia, ICE Candidate Exchange  
- **STUN/TURN**: For NAT traversal  

---

## 🔹 Project Setup

Clone the repo:  
```bash
git clone https://github.com/ChandraPratap01/WebRtc.git
```
```bash
cd Frontend
```
```bash
npm install
```
```bash
npm run dev
```
```bash
cd ..
```
```bash
cd Backend
```
```bash
tsc -b
```
```bash
node dist/index.js
```
## 🔹 Open the Application

Visit [http://localhost:5173/](http://localhost:5173/) in your browser to use the chat app.


## 🤝 Author

Made with ❤️ by **Chandra**

