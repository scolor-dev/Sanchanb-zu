import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/toast";
import Layout from "./components/layouts/Layout";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import './App.css'

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

export default App
