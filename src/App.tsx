import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import './App.css'
import { Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}

export default App
