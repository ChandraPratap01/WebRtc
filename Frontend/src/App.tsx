import { BrowserRouter, Route, Routes } from "react-router-dom";

import "tailwindcss";

import Background from "./Component/Background";
import Landing from "./Pages/Landing";
import Header from "./Component/Header";

import SenderRoom from "./Pages/SenderRoom";
import ReceiverRoom from "./Pages/ReceiverRoom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Background>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sender/:id" element={<SenderRoom/>}/>
          <Route path="/receiver/:id" element={<ReceiverRoom/>}/>
        </Routes>
        </Background>
      </BrowserRouter>
    </>
  );
}

export default App;
