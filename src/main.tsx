import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./utils/initDemoData";
import ThemeProvider from "@/components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
