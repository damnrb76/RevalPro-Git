import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeStorage } from "./lib/storage";

// Initialize IndexedDB storage
initializeStorage().catch(error => {
  console.error("Failed to initialize storage:", error);
});

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('PWA Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('PWA Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
