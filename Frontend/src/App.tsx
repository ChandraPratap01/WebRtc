import { BrowserRouter, Route, Routes } from "react-router-dom";

import "tailwindcss";

import Background from "./Component/Background";
import Landing from "./Pages/Landing";
import Header from "./Component/Header";
import Room from "./Pages/Room";

function App() {
  return (
    <>
      <BrowserRouter>
        <Background>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/id/:id" element={<Room/>}/>
        </Routes>
        </Background>
      </BrowserRouter>
    </>
  );
}

export default App;
