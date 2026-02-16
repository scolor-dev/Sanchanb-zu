import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import './App.css'
import { Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
