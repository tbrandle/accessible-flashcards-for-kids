import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/base.scss";

import App from "./components/App/App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
