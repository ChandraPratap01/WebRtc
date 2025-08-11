//Sender Logic

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const SenderRoom = () => {
  const SenderRef = useRef<HTMLVideoElement | null>(null);
  const Media = new MediaStream();
  const IncomingRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const wss = new WebSocket(`ws://localhost:3000`);
    wss.onerror = (err) => {
      return console.error(err);
      //Roasater
    };

    wss.onopen = () => {
      wss.send(JSON.stringify({ host: "Sender", type: "Join", id: id }));
    };

    //Starting Connection
    const pc = new RTCPeerConnection();
    peerRef.current = pc;

    pc.ontrack = (event) => {
      Media.addTrack(event.track);
      if (IncomingRef.current) {
        IncomingRef.current.srcObject = Media;
      }
    };

    //Sending Offer
    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer(); //create SDP;

        await pc.setLocalDescription(offer);

        if (wss && wss.readyState === WebSocket.OPEN) {
          wss.send(JSON.stringify({ type: "Offer", sdp: pc.localDescription }));
        }
      } catch (err) {
        console.log("Negotiation error ", err); //Roaster
      }
    };

    //sending Ice candidatae

    pc.onicecandidate = (event) => {
      if (event.candidate && wss?.readyState === WebSocket.OPEN) {
        wss.send(
          JSON.stringify({ type: "Ice_candidate", candidate: event.candidate })
        );
      }
    };

    // Handiling response from other end;

    if (wss) {
      wss.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "Answer") {
          await pc.setRemoteDescription(data.sdp);
        }
        // Accepting Ice_candidate;
        else if (data.type === "Ice_candidate") {
          pc.addIceCandidate(data.candidate);
        } else if (data.type === "Ready") {
          toast.success("Peer Connected!");
          StartCalling();
        } else if (data.type === "Sender Joined") {
          toast.success("Room Created Successfully!");
        }
      };
    }
    const setupStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      if (SenderRef.current) {
        SenderRef.current.srcObject = stream;
      }
    };
    setupStream();
  }, [id]);

  const StartCalling = async () => {
    if (streamRef.current && peerRef.current) {
      streamRef.current.getTracks().forEach((event) => {
        peerRef.current?.addTrack(event, streamRef.current!);
      });
    }
  };

  return (
    <div>
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
          ref={SenderRef}
          autoPlay
          playsInline
        ></video>
      </div>
    </div>
  );
};

export default SenderRoom;
