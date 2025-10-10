import axios from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;

console.log(import.meta.env.VITE_API_ENDPOINT);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
