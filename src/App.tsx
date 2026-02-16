import { Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
