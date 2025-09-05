import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeStorage } from "./lib/storage";

// Initialize IndexedDB storage
initializeStorage().catch(error => {
  console.error("Failed to initialize storage:", error);
});

createRoot(document.getElementById("root")!).render(<App />);
