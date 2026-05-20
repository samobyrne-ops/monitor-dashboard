import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const params = new URLSearchParams(window.location.search);
const theme = params.get("theme");
const isDark = theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
if (isDark) {
  document.documentElement.classList.add("dark");
  document.documentElement.setAttribute("data-mode", "dark");
} else {
  document.documentElement.setAttribute("data-mode", "light");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
