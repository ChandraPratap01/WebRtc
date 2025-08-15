import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const ReceiverRoom = () => {
  const { id } = useParams();

  const IncomingRef = useRef<HTMLVideoElement | null>(null);
  const ReceiverRef = useRef<HTMLVideoElement | null>(null);
  const Media = new MediaStream();
  useEffect(() => {
    const wss = new WebSocket(`ws://localhost:3000`);
    wss.onerror = (err) => {
      toast.error("Not Connected to Server")
      console.error(err);
      return;
    };
    wss.onopen = () => {
      wss.send(JSON.stringify({ host: "Receiver", type: "Join", id: id }));
    };
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      Media.addTrack(event.track);
      if (IncomingRef.current) {
        IncomingRef.current.srcObject = Media;
      }
    };

    if (wss) {
      wss.onmessage = async (event) => {
        const data = await JSON.parse(event.data);
        if (data.type === "Offer") {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          if (ReceiverRef.current) {
            ReceiverRef.current.srcObject = stream;
          }
          stream.getTracks().forEach((event) => {
            pc?.addTrack(event, stream);
          });

          pc?.setRemoteDescription(data.sdp);
          const answer = await pc?.createAnswer(); // create SDP;

          await pc?.setLocalDescription(answer);

          wss.send(
            JSON.stringify({ type: "Answer", sdp: pc.localDescription })
          );
        } else if (data.type === "Ice_candidate") {
          pc.addIceCandidate(data.candidate);
        } else if (data.type === "First Create Room") {
          toast.error("Room Doesn't Exist");
        } else if (data.type === "Ready") {
          toast.success("Peer Connected!");
        }
      };
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && wss.readyState === wss.OPEN) {
        wss.send(
          JSON.stringify({ type: "Ice_candidate", candidate: event.candidate })
        );
      }
    };
  }, [id]);

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
          ref={ReceiverRef}
          autoPlay
          playsInline
        ></video>
      </div>
    </div>
  );
};

export default ReceiverRoom;
