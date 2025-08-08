import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const ReceiverRoom = () => {
  const { id } = useParams();
  const [peer, Setpeer] = useState<RTCPeerConnection | null>(null);
  const videoref = useRef<HTMLVideoElement | null>(null);
  const Media = new MediaStream();
  useEffect(() => {
    const wss = new WebSocket(`ws://localhost:3000`);
    wss.onerror = (err) => {
      console.log(err);
      return;
    };
    wss.onopen = () => {
      alert(`Connected to the room ${id}`);
      wss.send(JSON.stringify({ type: "Join", id: id }));
    };
    const pc = new RTCPeerConnection();
    Setpeer(pc);
    console.log(pc);

    pc.ontrack = (event) => {
      console.log("Track Received");
      console.log(event);
      Media.addTrack(event.track);
      if (videoref.current) {
        videoref.current.srcObject = Media;
      }
    };

    if (wss) {
      wss.onmessage = async (event) => {
        const data = await JSON.parse(event.data);
        if (data.type === "Offer") {
          console.log("Offer Received");
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

  //  const Receive_call=()=>{

  //  }
  return (
    <div>
      <div className=" relative ml-10 mr-39 w-250 h-170 flex justify-center items-center  max-a-lg  rounded-lg overflow-hidden p-4 mb-1">
        <video
          className=" w-full h-full object-cover"
          ref={videoref}
          autoPlay
          playsInline
        ></video>
      </div>
      <div></div>
    </div>
  );
};

export default ReceiverRoom;
