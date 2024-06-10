import Home from "./components/Home.jsx";
import Sketches from "./components/Sketches.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sketches" element={<Sketches />} />
    </Routes>
  );
}

export default App;
