
import VidoUI from "../assets/VideoUI.png";
import { useEffect, useState } from "react";

const Header = () => {
  const [animation, Setanimation] = useState<string | null>(null);
  useEffect(() => {
   fetch(`https://api.giphy.com/v1/gifs/random?api_key=1iFLlMC90qFqA1h0ui7UrjCwMkA3wp1a&tag=anime`)
      .then((res) => res.json())
      .then((data) => Setanimation(data.data.images.original.url));
     
  }, []);
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 ">
        <div className=" flex font-bold items-center">
          <img src={VidoUI} height={60} width={60} alt="LOGO" />
          <h1 className="text-3xl justify-center ">VidBridge</h1>
          </div>
        <div>
         
            <div className="h-14 w-15 rounded-full bg-amber-500 p-1 flex items-center justify-center">
         {animation ?<img  src={animation} alt="Random Anime GIF" className="h-full w-full object-cover rounded-full"  />:<p> User</p>}
         
         </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
