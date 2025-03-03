import store from "@/redux/store.ts";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
  // </StrictMode>
);
