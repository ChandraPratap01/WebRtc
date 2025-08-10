import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const ReceiverRoom = () => {
  const { id } = useParams();

  const IncomingRef = useRef<HTMLVideoElement | null>(null);
  const ReceiverRef = useRef<HTMLVideoElement | null>(null);
  const Media = new MediaStream();
  useEffect(() => {
    const wss = new WebSocket(`ws://localhost:3000`);
    wss.onerror = (err) => {
      console.log(err);
      return;
    };
    wss.onopen = () => {
      alert(`Connected to the room ${id}`);
      wss.send(JSON.stringify({ host:"Receiver",type: "Join", id: id }));
    };
    const pc = new RTCPeerConnection();
    
    console.log(pc);

    pc.ontrack = (event) => {
      console.log("Track Received");
      console.log(event);
      Media.addTrack(event.track);
      if (IncomingRef.current) {
        IncomingRef.current.srcObject = Media;
      }
    };

    if (wss) {
      wss.onmessage = async (event) => {
        const data = await JSON.parse(event.data);
        if (data.type === "Offer") {
          console.log("Offer Received");

        const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    console.log(stream.getTracks());
    if (ReceiverRef.current) {
      ReceiverRef.current.srcObject = stream;
    }
    stream.getTracks().forEach((event) => {
      pc?.addTrack(event, stream);
    });
    console.log(data.sdp)
    console.log("Offer received and checking whether setRemmote is null or not")
          pc?.setRemoteDescription(data.sdp);
          const answer = await pc?.createAnswer();
          console.log(answer); // create SDP;
          await pc?.setLocalDescription(answer);
          console.log("setlocal description worked");
          console.log(pc.localDescription);
          wss.send(
            JSON.stringify({ type: "Answer", sdp: pc.localDescription })
          );
        } else if (data.type === "Ice_candidate") {
          console.log("Ice_candidate Received");
          console.log(data.candidate);
          pc.addIceCandidate(data.candidate);
        } 
      };
    }
    console.log("above Ice candidate");
    pc.onicecandidate = (event) => {
      console.log("BElow iscecandidate");
      console.log(event);
      console.log(wss.readyState === wss.OPEN);
      if (event.candidate && wss.readyState === wss.OPEN) {
        console.log(event.candidate);
        wss.send(
          JSON.stringify({ type: "Ice_candidate", candidate: event.candidate })
        );
      }
    };
    
  }, [id]);

  return (
    <div >
      <div className="bg-neutral-200 fixed ml-10 mr-39 w-250 h-170 flex justify-center items-center  max-a-lg  rounded-lg overflow-hidden p-1 ">
        <video
          className=" w-full h-full object-cover"
          ref={IncomingRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <div className=" absolute bg-neutral-200 ml-260 mt-90 flex flex-row-reverse  h-90  rounded-lg  w-100 ">
        <video
          className="  object-cover pt-0"
          ref={ReceiverRef}
          autoPlay
          playsInline
          
        ></video>
      </div>
    </div>
  );
};

export default ReceiverRoom;
