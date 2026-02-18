import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/toast";
import Layout from "./components/layouts/Layout";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import './App.css'
import { useEffect, useState } from "react";


function App() {
  <ModeChange/>
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

function ModeChange() {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [darkMode, setDarkMode] = useState(getSystemTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);
  return null;
}

export default App
