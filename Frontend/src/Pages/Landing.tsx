import { useState } from "react";
import { useNavigate } from "react-router-dom";



const Landing = () => {
  const [input,SetInput]=useState("");
  const navigate=useNavigate();
  return (
    <div className="min-h-screen  text-black">
      <div className="flex flex-col items-center justify-center mt-25 px-4">
        <h1 className="text-4xl font-bold mb-5">VidBridge</h1>

        <div className="w-full max-w-md border border-black p-6 rounded-xl flex flex-col gap-4 items-center">
          <input onChange={(e)=>{SetInput(e.target.value)}}
            type="text"
            placeholder="Enter Room ID"
            className="w-full px-4 py-2 border border- zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-700 bg-white text-black"
          />
          <button onClick={()=>navigate(`receiver/${input}`)} className="w-full bg-zinc-700  text-white py-2 rounded-md hover:opacity-80 transition">
            Join Room
          </button>

          <div className="flex items-center w-full my-2">
            <div className="flex-grow h-px bg-black" />
            <span className="mx-2 text-black text-sm">OR</span>
            <div className="flex-grow h-px bg-black" />
          </div>

          <button onClick={()=>navigate(`sender/${input}`)} className="w-full border border-black py-2  hover:opacity-80  rounded-md hover: bg-zinc-700 text-white transition">
            Create a New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
