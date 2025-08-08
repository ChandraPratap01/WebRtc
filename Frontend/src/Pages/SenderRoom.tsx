//Sender Logic

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const SenderRoom = () => {
  const videoref=useRef<HTMLVideoElement|null>(null);
  
  const[peer,Setpeer]=useState<RTCPeerConnection|null>(null);
  const { id } = useParams();
  useEffect(() => {
    const wss = new WebSocket(`ws://localhost:3000`);
    wss.onerror = (err) => {
      return console.log(err);
    };
    
    wss.onopen = () => {
      alert(`Connected to the room ${id}`);
      wss.send(JSON.stringify({ type: "Join", id: id }));
      
    };

  //Starting Connection
 const pc=new RTCPeerConnection();
  Setpeer(pc);
  console.log(pc);
  //Sending Offer
  pc.onnegotiationneeded=async ()=>{
    try{
      console.log("onnegotiaiton needed")
     const offer= await pc.createOffer();  //create SDP;
     console.log("Inside onnegotiationneeded")
     await pc.setLocalDescription(offer);
     console.log("LocalDescription:", pc.localDescription);
     console.log("WebSocket ReadyState:", wss);
     if(wss && wss.readyState===WebSocket.OPEN){
      wss.send(JSON.stringify({type:"Offer",sdp:pc.localDescription}))
      console.log("Offer Send")
     }
    }
    catch(err){
      console.log("Negotiation error ",err)
    }
  }

  //sending Ice candidatae
console.log("above ice candidate")
   pc.onicecandidate=(event)=>{
    console.log("below candidate"); 
       console.log(event);
    if(event.candidate && wss?.readyState===WebSocket.OPEN){
      wss.send(JSON.stringify({type:"Ice_candidate",candidate:event.candidate}))
      console.log(event.candidate);
      console.log("Ice CAndidate Send")
    }
  }

  // Handiling response from other end;

if(wss){
  wss.onmessage=async(event)=>{
    const data=JSON.parse(event.data);
    if(data.type==="Answer"){
      console.log(event.data)
     await pc.setRemoteDescription(data.sdp);
    }
    // Accepting Ice_candidate;
    else if(data.type==="Ice_candidate"){
      pc.addIceCandidate(data.candidate)
    }
  }}
 }, [id]);

const StartCalling=async()=>{
const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
stream.getTracks().forEach((event)=>{
  console.log("addtrack is working")
  peer?.addTrack(event,stream);
 })
 if(videoref.current){
  videoref.current.srcObject=stream;
 }
}
 
return <div>
<div className="  flex  justify-around  max-a-lg bg-red-300 h-120 rounded-lg  p-4 mb-1">
<video className=" w-full h-full  object-contain"  ref={videoref} autoPlay  playsInline></video>
</div>
<div>
<button  className="bg-amber-200" onClick={StartCalling}>Start Video Call</button>
</div>

</div>;
};

export default SenderRoom;
