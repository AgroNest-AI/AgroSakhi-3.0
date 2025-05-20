import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeI18n } from "./lib/i18n";

// Initialize i18n before rendering
initializeI18n().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
