import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";

import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
